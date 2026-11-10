package com.smartcollab.auth.config;

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
        // Seed default skills
        if (skillRepository.count() == 0) {
            List<Skill> defaultSkills = List.of(
                    new Skill("Java / Spring Boot", "BACKEND", "Développement backend robuste avec Spring Boot et Spring Cloud"),
                    new Skill("React.js", "FRONTEND", "Applications Web monopages interactives avec React et Hooks"),
                    new Skill("Docker & Kubernetes", "DEVOPS", "Conteneurisation et orchestration de microservices"),
                    new Skill("PostgreSQL", "BACKEND", "Bases de données relationnelles avancées et requêtage optimisé"),
                    new Skill("Python / Machine Learning", "DATA_AI", "Modélisation de données, algorithmes prédictifs et IA"),
                    new Skill("Tailwind CSS", "FRONTEND", "Framework CSS utility-first moderne et réactif"),
                    new Skill("Apache Kafka", "DEVOPS", "Architecture événementielle et messagerie distribuée temps réel"),
                    new Skill("Flutter / Dart", "MOBILE", "Développement d'applications mobiles cross-platform iOS & Android")
            );
            skillRepository.saveAll(defaultSkills);
            System.out.println("✅ [DataInitializer] Seeded 8 default skills");
        }

        // Seed demo users if not present individually
        seedUserIfNotExists(
                "student@emsi-edu.ma",
                "Student123!",
                "Hamza",
                "Arhrid",
                Role.STUDENT,
                "STU-EMSI-001",
                "Élève ingénieur passionné par les architectures Cloud-Native, Spring Boot et React."
        );

        seedUserIfNotExists(
                "prof@emsi-edu.ma",
                "Prof123!",
                "Karim",
                "Benali",
                Role.PROFESSOR,
                null,
                "Professeur en Génie Logiciel, responsable des Projets de Fin d'Études (PFE)."
        );

        seedUserIfNotExists(
                "admin@emsi-edu.ma",
                "Admin123!",
                "Direction",
                "Pédagogique EMSI",
                Role.ADMIN,
                null,
                "Administration centrale et coordination des projets de fin d'études EMSI."
        );
    }

    private void seedUserIfNotExists(
            String email,
            String rawPassword,
            String firstName,
            String lastName,
            Role role,
            String studentIdentifier,
            String bio
    ) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User(
                    email,
                    passwordEncoder.encode(rawPassword),
                    firstName,
                    lastName,
                    role
            );
            user.setStudentIdentifier(studentIdentifier);
            user.setBio(bio);
            userRepository.save(user);
            System.out.println("✅ [DataInitializer] Seeded account: " + email);
        }
    }
}
