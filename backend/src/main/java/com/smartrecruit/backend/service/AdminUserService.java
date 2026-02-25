package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.admin.AdminUserResponse;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.enums.RoleType;
import com.smartrecruit.backend.repository.JobDescriptionRepository;
import com.smartrecruit.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final JobDescriptionRepository jobDescriptionRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminUserResponse updateUserStatus(UUID targetUserId, boolean active, User currentUser) {
        if (currentUser == null || currentUser.getRole() != RoleType.ADMIN) {
            throw new AccessDeniedException("Only ADMIN can manage user status");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!active) {
            if (targetUser.getId().equals(currentUser.getId())) {
                throw new IllegalArgumentException("You cannot deactivate your own account");
            }

            if (targetUser.getRole() == RoleType.ADMIN && Boolean.TRUE.equals(targetUser.getActive())) {
                long activeAdmins = userRepository.countByRoleAndActiveTrue(RoleType.ADMIN);
                if (activeAdmins <= 1) {
                    throw new IllegalArgumentException("Cannot deactivate the last active admin");
                }
            }
        }

        targetUser.setActive(active);
        User savedUser = userRepository.save(targetUser);
        return toResponse(savedUser);
    }

    private AdminUserResponse toResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(Boolean.TRUE.equals(user.getActive()))
                .createdAt(user.getCreatedAt())
                .lastLogin(null)
                .jobCount(jobDescriptionRepository.countByRecruiterId(user.getId()))
                .build();
    }
}
