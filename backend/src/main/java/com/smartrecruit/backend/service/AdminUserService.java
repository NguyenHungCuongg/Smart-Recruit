package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.admin.AdminUserResponse;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.repository.JobDescriptionRepository;
import com.smartrecruit.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final JobDescriptionRepository jobDescriptionRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .map(user -> AdminUserResponse.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .active(true)
                        .createdAt(user.getCreatedAt())
                        .lastLogin(null)
                        .jobCount(jobDescriptionRepository.countByRecruiterId(user.getId()))
                        .build())
                .toList();
    }
}
