package com.smartrecruit.backend.dto.admin;

import com.smartrecruit.backend.enums.RoleType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class AdminUserResponse {
    private UUID id;
    private String fullName;
    private String email;
    private RoleType role;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private long jobCount;
}
