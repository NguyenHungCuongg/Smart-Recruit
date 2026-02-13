package com.smartrecruit.backend.service;

import com.smartrecruit.backend.domain.cv.CVFeatures;
import com.smartrecruit.backend.enums.IndustryType;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CVFeatureParser {

    private static final Pattern EMAIL = Pattern.compile(
            "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
            Pattern.CASE_INSENSITIVE
    );
    private static final Pattern PHONE = Pattern.compile(
            "(\\+?[0-9]{1,3}[-.\\s]?)?(\\(?[0-9]{2,4}\\)?[-.\\s]?)?[0-9]{3,}[-.\\s]?[0-9]{3,}([-.\\s]?[0-9]{2,})?"
    );
    // e.g. "3 years experience", "experience: 5 years", "5+ years", "2 năm kinh nghiệm"
    private static final Pattern EXPERIENCE_YEARS = Pattern.compile(
            "(?:experience|kinh\\s*nghiệm|exp\\.?)\\s*:?\\s*(\\d+)\\s*(?:\\+?\\s*years?|năm)?",
            Pattern.CASE_INSENSITIVE
    );
    private static final Pattern YEARS_STANDALONE = Pattern.compile(
            "\\b(\\d+)\\s*(?:\\+?\\s*years?|năm)\\s*(?:experience|kinh\\s*nghiệm)?",
            Pattern.CASE_INSENSITIVE
    );
    private static final Pattern GRADUATION_YEAR = Pattern.compile(
            "\\b(19|20)\\d{2}\\b"
    );

    // IT/Software Development Skills
    private static final Set<String> PROGRAMMING_LANGUAGES = Set.of(
            "java", "python", "javascript", "typescript", "c#", "c++", "go", "rust", "kotlin", "swift",
            "php", "ruby", "scala", "r", "sql", "html", "css"
    );
    private static final Set<String> FRAMEWORKS = Set.of(
            "spring", "spring boot", "django", "flask", "react", "angular", "vue", "node", "express",
            "nestjs", "hibernate", "laravel", "rails", ".net", "asp.net"
    );
    private static final Set<String> DATABASES = Set.of(
            "postgresql", "mysql", "mongodb", "redis", "sql server", "oracle", "sqlite", "elasticsearch"
    );

    // Marketing Skills
    private static final Set<String> MARKETING_SKILLS = Set.of(
            "seo", "sem", "google analytics", "google ads", "facebook ads", "content marketing",
            "social media marketing", "email marketing", "marketing automation", "copywriting",
            "content strategy", "brand management", "digital marketing", "inbound marketing",
            "hubspot", "salesforce marketing cloud", "mailchimp", "hootsuite"
    );

    // Sales Skills
    private static final Set<String> SALES_SKILLS = Set.of(
            "b2b sales", "b2c sales", "crm", "salesforce", "cold calling", "lead generation",
            "negotiation", "account management", "sales strategy", "pipeline management",
            "hubspot crm", "zoho crm", "business development", "sales forecasting"
    );

    // Accounting & Finance Skills
    private static final Set<String> ACCOUNTING_SKILLS = Set.of(
            "gaap", "ifrs", "financial reporting", "tax preparation", "auditing", "bookkeeping",
            "quickbooks", "excel", "financial analysis", "budgeting", "forecasting",
            "accounts payable", "accounts receivable", "sap", "oracle financials", "cost accounting"
    );

    // Healthcare Skills
    private static final Set<String> HEALTHCARE_SKILLS = Set.of(
            "patient care", "clinical skills", "emr", "electronic medical records", "hipaa",
            "medical terminology", "cpr", "first aid", "nursing", "diagnostic procedures",
            "iv therapy", "medication administration", "epic", "cerner"
    );

    // Universal Soft Skills
    private static final Set<String> SOFT_SKILLS = Set.of(
            "teamwork", "communication", "leadership", "problem solving", "time management",
            "critical thinking", "adaptability", "creativity", "attention to detail",
            "làm việc nhóm", "giao tiếp", "lãnh đạo", "giải quyết vấn đề"
    );

    private static final Set<String> DEGREE_KEYWORDS = Set.of(
            "bachelor", "master", "phd", "degree", "bằng cử nhân", "thạc sĩ", "tiến sĩ",
            "đại học", "university", "college", "cao đẳng", "engineer", "kỹ sư"
    );

    // Map industry to relevant skill sets
    private static final Map<IndustryType, List<Set<String>>> INDUSTRY_SKILL_POOLS = Map.of(
            IndustryType.IT, List.of(PROGRAMMING_LANGUAGES, FRAMEWORKS, DATABASES),
            IndustryType.MARKETING, List.of(MARKETING_SKILLS),
            IndustryType.SALES, List.of(SALES_SKILLS),
            IndustryType.ACCOUNTING, List.of(ACCOUNTING_SKILLS),
            IndustryType.FINANCE, List.of(ACCOUNTING_SKILLS), // Reuse accounting skills
            IndustryType.HEALTHCARE, List.of(HEALTHCARE_SKILLS)
    );

    /**
     * Parse CV text and extract features.
     * Uses generic skill parsing (all industries combined).
     */
    public CVFeatures parse(String rawText) {
        return parse(rawText, null);
    }

    /**
     * Parse CV text and extract features for a specific industry.
     * @param rawText The raw CV text
     * @param targetIndustry Optional industry hint for focused skill parsing
     */
    public CVFeatures parse(String rawText, IndustryType targetIndustry) {
        if (rawText == null || rawText.isBlank()) {
            return emptyFeatures();
        }
        String text = rawText.replace("\r\n", "\n").replace("\r", "\n");
        String lower = text.toLowerCase();

        CVFeatures.PersonalInfo personal = parsePersonal(text, lower);
        CVFeatures.ExperienceInfo experience = parseExperience(text, lower);
        CVFeatures.EducationInfo education = parseEducation(text, lower);
        CVFeatures.SkillsInfo skills = parseSkills(lower, targetIndustry);

        return CVFeatures.builder()
                .personal(personal)
                .experience(experience)
                .education(education)
                .skills(skills)
                .mlVectors(null)
                .build();
    }

    private CVFeatures.PersonalInfo parsePersonal(String text, String lower) {
        String email = firstMatch(EMAIL, text);
        String phone = firstMatch(PHONE, text);
        String name = extractName(text);
        return CVFeatures.PersonalInfo.builder()
                .name(name != null ? name : "")
                .email(email != null ? email : "")
                .phone(phone != null ? phone : "")
                .build();
    }

    private String extractName(String text) {
        String[] lines = text.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty() || line.length() > 100) continue;
            if (EMAIL.matcher(line).matches() || PHONE.matcher(line).find()) continue;
            if (line.matches("^[A-Za-zÀ-ỹ\\s.-]+$") && line.length() >= 2) {
                return line;
            }
        }
        return null;
    }

    private CVFeatures.ExperienceInfo parseExperience(String text, String lower) {
        Integer years = null;
        Matcher m = EXPERIENCE_YEARS.matcher(text);
        if (m.find()) {
            try {
                years = Integer.parseInt(m.group(1));
            } catch (NumberFormatException ignored) {}
        }
        if (years == null) {
            m = YEARS_STANDALONE.matcher(text);
            if (m.find()) {
                try {
                    years = Integer.parseInt(m.group(1));
                } catch (NumberFormatException ignored) {}
            }
        }
        return CVFeatures.ExperienceInfo.builder()
                .totalYears(years)
                .positions(null)
                .build();
    }

    private CVFeatures.EducationInfo parseEducation(String text, String lower) {
        String degree = null;
        for (String kw : DEGREE_KEYWORDS) {
            if (lower.contains(kw)) {
                degree = kw;
                break;
            }
        }
        Integer graduationYear = null;
        Matcher m = GRADUATION_YEAR.matcher(text);
        if (m.find()) {
            try {
                int y = Integer.parseInt(m.group(0));
                if (y >= 1990 && y <= 2030) graduationYear = y;
            } catch (NumberFormatException ignored) {}
        }
        return CVFeatures.EducationInfo.builder()
                .highestDegree(degree != null ? degree : "")
                .field("")
                .university("")
                .graduationYear(graduationYear)
                .build();
    }

    private CVFeatures.SkillsInfo parseSkills(String lower, IndustryType targetIndustry) {
        List<String> domainSkills = new ArrayList<>();
        List<String> soft = findKeywords(lower, SOFT_SKILLS);

        if (targetIndustry != null && INDUSTRY_SKILL_POOLS.containsKey(targetIndustry)) {
            // Focused parsing: only search relevant skills for the target industry
            for (Set<String> skillPool : INDUSTRY_SKILL_POOLS.get(targetIndustry)) {
                domainSkills.addAll(findKeywords(lower, skillPool));
            }
        } else {
            // Generic parsing: search all skill pools across all industries
            domainSkills.addAll(findKeywords(lower, PROGRAMMING_LANGUAGES));
            domainSkills.addAll(findKeywords(lower, FRAMEWORKS));
            domainSkills.addAll(findKeywords(lower, DATABASES));
            domainSkills.addAll(findKeywords(lower, MARKETING_SKILLS));
            domainSkills.addAll(findKeywords(lower, SALES_SKILLS));
            domainSkills.addAll(findKeywords(lower, ACCOUNTING_SKILLS));
            domainSkills.addAll(findKeywords(lower, HEALTHCARE_SKILLS));
        }

        return CVFeatures.SkillsInfo.builder()
                .domainSkills(domainSkills.isEmpty() ? List.of() : domainSkills)
                .softSkills(soft)
                .build();
    }

    private List<String> findKeywords(String lower, Set<String> keywords) {
        Set<String> found = new LinkedHashSet<>();
        for (String kw : keywords) {
            if (lower.contains(kw)) found.add(kw);
        }
        return new ArrayList<>(found);
    }

    private String firstMatch(Pattern pattern, String text) {
        Matcher m = pattern.matcher(text);
        return m.find() ? m.group(0).trim() : null;
    }

    private static CVFeatures emptyFeatures() {
        return CVFeatures.builder()
                .personal(CVFeatures.PersonalInfo.builder().name("").email("").phone("").build())
                .experience(CVFeatures.ExperienceInfo.builder().totalYears(null).positions(null).build())
                .education(CVFeatures.EducationInfo.builder().highestDegree("").field("").university("").graduationYear(null).build())
                .skills(CVFeatures.SkillsInfo.builder()
                        .domainSkills(List.of())
                        .softSkills(List.of())
                        .build())
                .mlVectors(null)
                .build();
    }
}
