package com.smartrecruit.backend.dto.candidate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {

    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private List<CVSummaryResponse> cvs;
}
