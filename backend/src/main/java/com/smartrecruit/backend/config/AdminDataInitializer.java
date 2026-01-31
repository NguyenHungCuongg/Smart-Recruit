package com.smartrecruit.backend.config;

import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.enums.RoleType;
import com.smartrecruit.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminDataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.init.admin.email:}")
    private String adminEmail;

    @Value("${app.init.admin.password:}")
    private String adminPassword;

    @Value("${app.init.admin.full-name:Administrator}")
    private String adminFullName;

    @Override
    public void run(ApplicationArguments args) {
        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            return;
        }
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin user already exists: {}", adminEmail);
            return;
        }

        User admin = User.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .fullName(adminFullName)
                .role(RoleType.ADMIN)
                .build();
        userRepository.save(admin);
        log.info("Created initial Admin user: {}", adminEmail);
    }
}
