package com.smartrecruit.backend.service;

import com.smartrecruit.backend.domain.job.JobRequirements;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class JDFeatureParser {

    // Regex patterns for experience requirements
    private static final Pattern MIN_EXPERIENCE = Pattern.compile(
            "(?:minimum|min\\.?|at\\s+least|requires?)\\s*(\\d+)\\s*(?:\\+?\\s*(?:years?|yrs?))",
            Pattern.CASE_INSENSITIVE
    );
    private static final Pattern EXPERIENCE_RANGE = Pattern.compile(
            "(\\d+)\\s*(?:-|to)\\s*(\\d+)\\s*(?:years?|yrs?)",
            Pattern.CASE_INSENSITIVE
    );
    private static final Pattern YEARS_PLUS = Pattern.compile(
            "(\\d+)\\s*\\+\\s*(?:years?|yrs?)",
            Pattern.CASE_INSENSITIVE
    );

    // IT/Software Development Skills
    private static final Set<String> PROGRAMMING_LANGUAGES = Set.of(
            "java", "python", "javascript", "typescript", "c#", "c++", "go", "rust", "kotlin", "swift",
            "php", "ruby", "scala", "r", "sql", "html", "css", "c", "perl"
    );
    private static final Set<String> FRAMEWORKS = Set.of(
            "spring", "spring boot", "django", "flask", "react", "angular", "vue", "node", "express",
            "nestjs", "hibernate", "laravel", "rails", ".net", "asp.net", "fastapi", "nextjs", "vuejs"
    );
    private static final Set<String> DATABASES = Set.of(
            "postgresql", "mysql", "mongodb", "redis", "sql server", "oracle", "sqlite", "elasticsearch",
            "postgres", "mariadb", "cassandra", "dynamodb"
    );
    private static final Set<String> DEVOPS_TOOLS = Set.of(
            "docker", "kubernetes", "jenkins", "gitlab", "github actions", "aws", "azure", "gcp",
            "terraform", "ansible", "ci/cd", "git"
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

    // Soft Skills
    private static final Set<String> SOFT_SKILLS = Set.of(
            "teamwork", "communication", "leadership", "problem solving", "time management",
            "critical thinking", "adaptability", "creativity", "attention to detail",
            "analytical", "collaboration", "interpersonal"
    );

    // Education levels
    private static final Set<String> BACHELOR_KEYWORDS = Set.of(
            "bachelor", "bachelor's", "bs", "ba", "bsc", "undergraduate", "degree"
    );
    private static final Set<String> MASTER_KEYWORDS = Set.of(
            "master", "master's", "ms", "ma", "msc", "graduate degree"
    );
    private static final Set<String> PHD_KEYWORDS = Set.of(
            "phd", "ph.d", "doctorate", "doctoral"
    );

    // Seniority levels
    private static final Set<String> JUNIOR_KEYWORDS = Set.of(
            "junior", "entry level", "entry-level", "associate", "beginner"
    );
    private static final Set<String> MID_KEYWORDS = Set.of(
            "mid level", "mid-level", "intermediate", "regular"
    );
    private static final Set<String> SENIOR_KEYWORDS = Set.of(
            "senior", "lead", "principal", "staff", "expert"
    );

    /**
     * Parse JobRequirements from JD text
     */
    public JobRequirements parse(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return emptyRequirements();
        }

        String text = rawText.replace("\r\n", "\n").replace("\r", "\n");
        String lower = text.toLowerCase();

        List<String> skills = parseSkills(lower);
        Integer minExperience = parseMinExperience(text);
        String education = parseEducation(lower);
        String seniority = parseSeniority(lower);

        return JobRequirements.builder()
                .skills(skills)
                .minExperience(minExperience)
                .education(education)
                .seniority(seniority)
                .build();
    }

    /**
     * Parse skills from JD text
     */
    private List<String> parseSkills(String lower) {
        Set<String> found = new LinkedHashSet<>();

        // Parse all skill categories
        found.addAll(findKeywords(lower, PROGRAMMING_LANGUAGES));
        found.addAll(findKeywords(lower, FRAMEWORKS));
        found.addAll(findKeywords(lower, DATABASES));
        found.addAll(findKeywords(lower, DEVOPS_TOOLS));
        found.addAll(findKeywords(lower, MARKETING_SKILLS));
        found.addAll(findKeywords(lower, SALES_SKILLS));
        found.addAll(findKeywords(lower, ACCOUNTING_SKILLS));
        found.addAll(findKeywords(lower, HEALTHCARE_SKILLS));
        found.addAll(findKeywords(lower, SOFT_SKILLS));

        return new ArrayList<>(found);
    }

    /**
     * Parse minimum experience requirement
     */
    private Integer parseMinExperience(String text) {
        // Try "minimum X years"
        Matcher m = MIN_EXPERIENCE.matcher(text);
        if (m.find()) {
            try {
                return Integer.parseInt(m.group(1));
            } catch (NumberFormatException ignored) {}
        }

        // Try "X+ years"
        m = YEARS_PLUS.matcher(text);
        if (m.find()) {
            try {
                return Integer.parseInt(m.group(1));
            } catch (NumberFormatException ignored) {}
        }

        // Try "X-Y years" (take minimum)
        m = EXPERIENCE_RANGE.matcher(text);
        if (m.find()) {
            try {
                return Integer.parseInt(m.group(1));
            } catch (NumberFormatException ignored) {}
        }

        return null;
    }

    /**
     * Parse education requirement
     */
    private String parseEducation(String lower) {
        // Check for PhD first (most specific)
        if (containsAny(lower, PHD_KEYWORDS)) {
            return "PHD";
        }
        // Then Master's
        if (containsAny(lower, MASTER_KEYWORDS)) {
            return "MASTER";
        }
        // Then Bachelor's
        if (containsAny(lower, BACHELOR_KEYWORDS)) {
            return "BACHELOR";
        }
        return null;
    }

    /**
     * Parse seniority level
     */
    private String parseSeniority(String lower) {
        // Check for Senior first
        if (containsAny(lower, SENIOR_KEYWORDS)) {
            return "SENIOR";
        }
        // Then Mid-level
        if (containsAny(lower, MID_KEYWORDS)) {
            return "MID_LEVEL";
        }
        // Then Junior
        if (containsAny(lower, JUNIOR_KEYWORDS)) {
            return "JUNIOR";
        }
        return null;
    }

    /**
     * Find keywords from a set in the text
     */
    private List<String> findKeywords(String lower, Set<String> keywords) {
        List<String> found = new ArrayList<>();
        for (String kw : keywords) {
            if (lower.contains(kw)) {
                found.add(kw);
            }
        }
        return found;
    }

    /**
     * Check if text contains any keyword from the set
     */
    private boolean containsAny(String text, Set<String> keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Create empty JobRequirements
     */
    private JobRequirements emptyRequirements() {
        return JobRequirements.builder()
                .skills(new ArrayList<>())
                .minExperience(null)
                .education(null)
                .seniority(null)
                .build();
    }
}
