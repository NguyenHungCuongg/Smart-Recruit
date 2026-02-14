package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.ml.FeatureVector;
import com.smartrecruit.backend.entity.CV;
import com.smartrecruit.backend.entity.JobDescription;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FeatureEngineeringService {

    public FeatureVector extractFeatures(JobDescription job, CV cv) {
        log.debug("Extracting features for Job[{}] + CV[{}]", 
                  job.getId(), cv.getId());

        // Parse dữ liệu
        Set<String> jobSkills = parseSkills(job.getRequirements().getSkills());
        Set<String> cvSkills = parseSkills(cv.getFeatures().getSkills().getDomainSkills());
        
        Integer jobMinExp = job.getRequirements().getMinExperience();
        Integer cvTotalExp = cv.getFeatures().getExperience().getTotalYears();
        
        String jobEducation = job.getRequirements().getEducation();
        String cvEducation = cv.getFeatures().getEducation().getHighestDegree();
        
        String jobSeniority = job.getRequirements().getSeniority();

        // Extract skill features (6 features)
        Map<String, Object> skillFeatures = extractSkillFeatures(jobSkills, cvSkills);

        // Extract experience features (5 features)
        Map<String, Object> expFeatures = extractExperienceFeatures(jobMinExp, cvTotalExp);

        // Extract education features (4 features)
        Map<String, Object> eduFeatures = extractEducationFeatures(jobEducation, cvEducation);

        // Extract seniority feature (1 feature)
        int seniorityScore = calculateSeniorityMatch(jobSeniority, cvTotalExp);
        
        // Tạo FeatureVector
        FeatureVector features = FeatureVector.builder()
            // Skill features
            .skillJaccard((Double) skillFeatures.get("jaccard"))
            .skillCoverage((Double) skillFeatures.get("coverage"))
            .skillPrecision((Double) skillFeatures.get("precision"))
            .skillOverlapCount((Integer) skillFeatures.get("overlapCount"))
            .jobSkillsCount((Integer) skillFeatures.get("jobCount"))
            .cvSkillsCount((Integer) skillFeatures.get("cvCount"))
            
            // Experience features
            .experienceGap((Double) expFeatures.get("gap"))
            .experienceRatio((Double) expFeatures.get("ratio"))
            .experienceMatch((Integer) expFeatures.get("match"))
            .jobExperienceRequired(jobMinExp != null ? jobMinExp.doubleValue() : 0.0)
            .cvExperienceYears(cvTotalExp != null ? cvTotalExp.doubleValue() : 0.0)
            
            // Education features
            .educationGap((Integer) eduFeatures.get("gap"))
            .educationMatch((Integer) eduFeatures.get("match"))
            .jobEducationLevel((Integer) eduFeatures.get("jobLevel"))
            .cvEducationLevel((Integer) eduFeatures.get("cvLevel"))
            
            // Seniority feature
            .seniorityMatchScore(seniorityScore)
            
            .build();
        
        log.debug("Extracted features: skillJaccard={}, expGap={}, eduMatch={}", 
                  features.getSkillJaccard(), 
                  features.getExperienceGap(),
                  features.getEducationMatch());
        
        return features;
    }

    private Map<String, Object> extractSkillFeatures(Set<String> jobSkills, Set<String> cvSkills) {
        Map<String, Object> features = new HashMap<>();
        
        // Base case: trường hợp set rỗng
        if (jobSkills.isEmpty() && cvSkills.isEmpty()) {
            features.put("jaccard", 0.0);
            features.put("coverage", 0.0);
            features.put("precision", 0.0);
            features.put("overlapCount", 0);
            features.put("jobCount", 0);
            features.put("cvCount", 0);
            return features;
        }
        
        // Calculate overlap
        Set<String> overlap = new HashSet<>(jobSkills);
        overlap.retainAll(cvSkills);
        
        int overlapCount = overlap.size();
        int jobCount = jobSkills.size();
        int cvCount = cvSkills.size();
        
        // Tính Jaccard similarity
        Set<String> union = new HashSet<>(jobSkills);
        union.addAll(cvSkills);
        double jaccard = union.isEmpty() ? 0.0 : (double) overlapCount / union.size();
        
        // Tính Coverage
        double coverage = jobCount == 0 ? 0.0 : (double) overlapCount / jobCount;
        
        // Tính Precision
        double precision = cvCount == 0 ? 0.0 : (double) overlapCount / cvCount;
        
        features.put("jaccard", jaccard);
        features.put("coverage", coverage);
        features.put("precision", precision);
        features.put("overlapCount", overlapCount);
        features.put("jobCount", jobCount);
        features.put("cvCount", cvCount);
        
        return features;
    }

    private Set<String> parseSkills(List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return Collections.emptySet();
        }
        
        return skills.stream()
            .filter(Objects::nonNull)
            .map(String::trim)
            .map(String::toLowerCase)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toSet());
    }

    private Map<String, Object> extractExperienceFeatures(Integer jobMinExp, Integer cvTotalExp) {
        Map<String, Object> features = new HashMap<>();

        double jobExp = jobMinExp != null ? jobMinExp.doubleValue() : 0.0;
        double cvExp = cvTotalExp != null ? cvTotalExp.doubleValue() : 0.0;

        double gap = Math.abs(cvExp - jobExp);

        double ratio = jobExp == 0.0 ? 0.0 : cvExp / jobExp;

        int match = cvExp >= jobExp ? 1 : 0;
        
        features.put("gap", gap);
        features.put("ratio", ratio);
        features.put("match", match);
        features.put("jobExp", jobExp);
        features.put("cvExp", cvExp);
        
        return features;
    }

    private Map<String, Object> extractEducationFeatures(String jobEducation, String cvEducation) {
        Map<String, Object> features = new HashMap<>();
        
        int jobLevel = mapEducationLevel(jobEducation);
        int cvLevel = mapEducationLevel(cvEducation);

        int gap = Math.abs(cvLevel - jobLevel);

        int match = cvLevel >= jobLevel ? 1 : 0;
        
        features.put("gap", gap);
        features.put("match", match);
        features.put("jobLevel", jobLevel);
        features.put("cvLevel", cvLevel);
        
        return features;
    }

    private int mapEducationLevel(String education) {
        if (education == null || education.trim().isEmpty()) {
            return 1;
        }
        
        String normalized = education.toLowerCase().trim();
        
        if (normalized.contains("phd") || normalized.contains("doctorate")) {
            return 5;
        } else if (normalized.contains("master") || normalized.contains("mba")) {
            return 4;
        } else if (normalized.contains("bachelor") || normalized.contains("degree")) {
            return 3;
        } else if (normalized.contains("associate") || normalized.contains("diploma")) {
            return 2;
        } else {
            return 1;
        }
    }

    private int calculateSeniorityMatch(String jobSeniority, Integer cvTotalExp) {
        if (jobSeniority == null || cvTotalExp == null) {
            return 0;
        }
        
        String normalized = jobSeniority.toLowerCase().trim();
        int jobLevel = mapSeniorityLevel(normalized);
        int cvLevel = mapSeniorityLevelFromYears(cvTotalExp);
        
        int diff = Math.abs(cvLevel - jobLevel);
        
        if (diff == 0) {
            return 1;
        } else if (diff == 1) {
            return 0;
        } else {
            return -1;
        }
    }
    
    private int mapSeniorityLevel(String seniority) {
        if (seniority.contains("junior") || seniority.contains("entry")) {
            return 1;
        } else if (seniority.contains("mid") || seniority.contains("intermediate")) {
            return 2;
        } else if (seniority.contains("senior")) {
            return 3;
        } else if (seniority.contains("lead") || seniority.contains("principal") || seniority.contains("staff")) {
            return 4;
        } else {
            return 2;
        }
    }
    
    private int mapSeniorityLevelFromYears(int years) {
        if (years < 2) {
            return 1;
        } else if (years < 5) {
            return 2;
        } else if (years < 8) {
            return 3;
        } else {
            return 4;
        }
    }
}

