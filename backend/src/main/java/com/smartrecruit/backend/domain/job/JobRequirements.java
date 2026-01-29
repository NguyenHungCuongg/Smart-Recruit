package com.smartrecruit.backend.domain.job;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequirements {
    private List<String> skills;
    private Integer minExperience;
    private String education;
    private String seniority;
}
