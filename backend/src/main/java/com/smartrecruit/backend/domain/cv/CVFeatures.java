package com.smartrecruit.backend.domain.cv;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVFeatures {
  private PersonalInfo personal;
    private ExperienceInfo experience;
    private EducationInfo education;
    private SkillsInfo skills;
    private MLVectors mlVectors;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonalInfo {
        private String name;
        private String email;
        private String phone;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExperienceInfo {
        private Integer totalYears;
        private List<Position> positions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Position {
        private String title;
        private String company;
        private Integer durationMonths;
        private List<String> technologies;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EducationInfo {
        private String highestDegree;
        private String field;
        private String university;
        private Integer graduationYear;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillsInfo {
        private List<String> programmingLanguages;
        private List<String> frameworks;
        private List<String> databases;
        private List<String> softSkills;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MLVectors {
        private List<Double> skillEmbedding;  // 768-dim vector from BERT/Sentence-BERT
        private Double experienceScore;       // Normalized 0-1
        private Double educationScore;        // Normalized 0-1
    }
}
