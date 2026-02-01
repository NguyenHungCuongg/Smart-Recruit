package com.smartrecruit.backend.dto.candidate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateRequest {

    @NotBlank
    @Size(max = 255)
    private String fullName;

    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 50)
    private String phone;
}
