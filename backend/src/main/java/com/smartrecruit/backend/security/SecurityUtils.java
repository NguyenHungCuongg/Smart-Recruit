package com.smartrecruit.backend.security;

import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.UUID;

// Class Utility để lấy thông tin người dùng hiện tại từ SecurityContext
@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

      
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(email).orElse(null);
        }
        
        return null;
    }

    public UUID getCurrentUserId() {
        User currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getId() : null;
    }

    public String getCurrentUserEmail() {
        User currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getEmail() : null;
    }

    public boolean isCurrentUserAdmin() {
        User currentUser = getCurrentUser();
        return currentUser != null && "ADMIN".equals(currentUser.getRole());
    }

    // Kiểm tra nếu người dùng hiện tại là chủ sở hữu của một "tài nguyên" nào đó (ví dụ: JobDescription, EvaluationHistory, v.v.)
    public boolean isCurrentUserOwner(UUID ownerId) {
        UUID currentUserId = getCurrentUserId();
        return currentUserId != null && currentUserId.equals(ownerId);
    }

    public boolean canCurrentUserAccess(UUID ownerId) {
        return isCurrentUserAdmin() || isCurrentUserOwner(ownerId);
    }
}
