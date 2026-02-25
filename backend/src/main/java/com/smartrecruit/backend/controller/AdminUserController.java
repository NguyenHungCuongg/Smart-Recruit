package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.admin.AdminUserStatusUpdateRequest;
import com.smartrecruit.backend.dto.admin.AdminUserResponse;
import com.smartrecruit.backend.security.SecurityUtils;
import com.smartrecruit.backend.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> listUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<AdminUserResponse> updateUserStatus(
            @PathVariable UUID userId,
            @Valid @RequestBody AdminUserStatusUpdateRequest request
    ) {
        AdminUserResponse updated = adminUserService.updateUserStatus(userId, request.getActive(), securityUtils.getCurrentUser());
        return ResponseEntity.ok(updated);
    }
}
