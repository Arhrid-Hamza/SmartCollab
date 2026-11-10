package com.smartcollab.auth.config;

import com.smartcollab.auth.model.Campus;
import com.smartcollab.auth.model.Role;
import com.smartcollab.auth.model.Skill;
import com.smartcollab.auth.model.User;
import com.smartcollab.auth.repository.SkillRepository;
import com.smartcollab.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, SkillRepository skillRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default skills if empty
        if (skillRepository.count() == 0) {
            List<Skill> defaultSkills = List.of(
                    new Skill("Java / Spring Boot", "BACKEND", "Développement backend robuste avec Spring Boot et Spring Cloud"),
                    new Skill("React.js", "FRONTEND", "Applications Web monopages interactives avec React et Hooks"),
                    new Skill("Docker & Kubernetes", "DEVOPS", "Conteneurisation et orchestration de microservices"),
                    new Skill("MySQL", "BACKEND", "Bases de données relationnelles MySQL et requêtage optimisé"),
                    new Skill("Python / Machine Learning", "DATA_AI", "Modélisation de données, algorithmes prédictifs et IA"),
                    new Skill("Tailwind CSS", "FRONTEND", "Framework CSS utility-first moderne et réactif"),
                    new Skill("Apache Kafka", "DEVOPS", "Architecture événementielle et messagerie distribuée temps réel"),
                    new Skill("Flutter / Dart", "MOBILE", "Développement d'applications mobiles cross-platform iOS & Android")
            );
            skillRepository.saveAll(defaultSkills);
            System.out.println("[DataInitializer] Seeded default skills");
        }

        // Remove legacy demo accounts if present
        userRepository.findByEmail("student@emsi-edu.ma").ifPresent(userRepository::delete);
        userRepository.findByEmail("prof@emsi-edu.ma").ifPresent(userRepository::delete);

        // Seed / ensure the unique Administrator user: admin@emsi-edu.ma with password "admin"
        User adminUser = userRepository.findByEmail("admin@emsi-edu.ma").orElse(null);
        if (adminUser == null) {
            adminUser = new User(
                    "admin@emsi-edu.ma",
                    passwordEncoder.encode("admin"),
                    "Direction",
                    "Admin EMSI",
                    Role.ADMIN,
                    Campus.ALL
            );
            adminUser.setBio("Administrateur général EMSI avec supervision globale sur tous les campus et utilisateurs.");
            userRepository.save(adminUser);
            System.out.println("[DataInitializer] Created single admin user: admin@emsi-edu.ma (pwd: admin, role: ADMIN, campus: ALL)");
        } else {
            adminUser.setPasswordHash(passwordEncoder.encode("admin"));
            adminUser.setRole(Role.ADMIN);
            adminUser.setCampus(Campus.ALL);
            adminUser.setBio("Administrateur général EMSI avec supervision globale sur tous les campus et utilisateurs.");
            userRepository.save(adminUser);
            System.out.println("[DataInitializer] Updated admin user password to 'admin' with all permissions (campus: ALL)");
        }
    }
}
