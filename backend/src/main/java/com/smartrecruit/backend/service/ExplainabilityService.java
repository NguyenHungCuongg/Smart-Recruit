package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.evaluation.CandidateExplainabilityDTO;
import com.smartrecruit.backend.dto.ml.FeatureVector;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExplainabilityService {

    public CandidateExplainabilityDTO buildExplainability(FeatureVector features, Double score, Double confidence) {
        if (features == null) {
            return null;
        }

        double skillsScore = toScore(
                weightedAverage(
                        safe(features.getSkillCoverage()),
                        safe(features.getSkillJaccard()),
                        safe(features.getSkillPrecision())
                )
        );

        double experienceScore = toScore(
                weightedAverage(
                        safe(features.getExperienceMatch()),
                        ratioToUnit(features.getExperienceRatio()),
                        1.0 - clamp01(safe(features.getExperienceGap()) / 10.0)
                )
        );

        double educationScore = toScore(
                weightedAverage(
                        safe(features.getEducationMatch()),
                        1.0 - clamp01(safe(features.getEducationGap()) / 4.0)
                )
        );

        double seniorityScore = toScore(
                seniorityToUnit(features.getSeniorityMatchScore())
        );

        List<String> strengths = new ArrayList<>();
        List<String> gaps = new ArrayList<>();

        collectInsight("Skills", skillsScore, strengths, gaps);
        collectInsight("Experience", experienceScore, strengths, gaps);
        collectInsight("Education", educationScore, strengths, gaps);
        collectInsight("Seniority", seniorityScore, strengths, gaps);

        String confidenceBand = resolveConfidenceBand(confidence);
        double overallFit = score != null ? round2(score) : round2(weightedAverage(
                skillsScore,
                experienceScore,
                educationScore,
                seniorityScore
        ));

        String summary = buildSummary(overallFit, confidenceBand, strengths, gaps);

        return CandidateExplainabilityDTO.builder()
                .skillsScore(round2(skillsScore))
                .experienceScore(round2(experienceScore))
                .educationScore(round2(educationScore))
                .seniorityScore(round2(seniorityScore))
                .overallFitScore(round2(overallFit))
                .confidenceBand(confidenceBand)
                .strengths(strengths)
                .gaps(gaps)
                .summary(summary)
                .build();
    }

    private void collectInsight(String label, double score, List<String> strengths, List<String> gaps) {
        if (score >= 75.0) {
            strengths.add(label + " match is strong (" + round2(score) + "/100)");
        } else if (score < 50.0) {
            gaps.add(label + " match is low (" + round2(score) + "/100)");
        }
    }

    private String buildSummary(double overallFit, String confidenceBand, List<String> strengths, List<String> gaps) {
        String fitLabel;
        if (overallFit >= 80.0) {
            fitLabel = "high";
        } else if (overallFit >= 60.0) {
            fitLabel = "moderate";
        } else {
            fitLabel = "low";
        }

        String topStrength = strengths.isEmpty() ? "No dominant strength" : strengths.get(0);
        String topGap = gaps.isEmpty() ? "No critical gap detected" : gaps.get(0);

        return "Overall JD fit is " + fitLabel + " with " + confidenceBand.toLowerCase() +
                " confidence. " + topStrength + ". " + topGap + ".";
    }

    private String resolveConfidenceBand(Double confidence) {
        if (confidence == null) {
            return "MEDIUM";
        }
        if (confidence >= 0.8) {
            return "HIGH";
        }
        if (confidence >= 0.5) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private double seniorityToUnit(Integer score) {
        if (score == null) {
            return 0.5;
        }
        if (score >= 1) {
            return 1.0;
        }
        if (score == 0) {
            return 0.5;
        }
        return 0.0;
    }

    private double ratioToUnit(Double ratio) {
        if (ratio == null || ratio <= 0.0) {
            return 0.0;
        }
        return clamp01(ratio >= 1.0 ? 1.0 : ratio);
    }

    private double toScore(double unitValue) {
        return clamp01(unitValue) * 100.0;
    }

    private double weightedAverage(double... values) {
        if (values == null || values.length == 0) {
            return 0.0;
        }
        double sum = 0.0;
        for (double value : values) {
            sum += value;
        }
        return sum / values.length;
    }

    private double safe(Double value) {
        return value == null ? 0.0 : value;
    }

    private double safe(Integer value) {
        return value == null ? 0.0 : value.doubleValue();
    }

    private double clamp01(double value) {
        if (value < 0.0) {
            return 0.0;
        }
        return Math.min(value, 1.0);
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
