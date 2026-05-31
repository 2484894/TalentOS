package com.arpan.placementBackend.config;

import com.arpan.placementBackend.enums.Role;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL    = "admin@portal.com";
    private static final String ADMIN_PASSWORD = "admin123";
    private static final String ADMIN_NAME     = "System Admin";

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            // Make sure existing admin is active and password is correct
            userRepository.findByEmail(ADMIN_EMAIL).ifPresent(admin -> {
                boolean updated = false;
                if (!admin.isActive()) {
                    admin.setActive(true);
                    updated = true;
                }
                if (admin.getRole() != Role.ADMIN) {
                    admin.setRole(Role.ADMIN);
                    updated = true;
                }
                // Reset password every startup so we always know what it is
                admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                userRepository.save(admin);
                log.info("✅ Admin user verified: {} (password reset to: {})", ADMIN_EMAIL, ADMIN_PASSWORD);
            });
        } else {
            User admin = User.builder()
                    .name(ADMIN_NAME)
                    .email(ADMIN_EMAIL)
                    .password(passwordEncoder.encode(ADMIN_PASSWORD))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin user created: {} / {}", ADMIN_EMAIL, ADMIN_PASSWORD);
        }
    }
}