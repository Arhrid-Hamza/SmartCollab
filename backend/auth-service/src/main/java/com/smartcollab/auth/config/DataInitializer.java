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

        // Seed demo users if not present
        if (userRepository.count() == 0) {
            // 1. Student
            User student = new User(
                    "student@smartcollab.edu",
                    passwordEncoder.encode("Student123!"),
                    "Hamza",
                    "Arhrid",
                    Role.STUDENT
            );
            student.setStudentIdentifier("STU-2026-001");
            student.setBio("Élève ingénieur passionné par les architectures Cloud-Native, Spring Boot et React.");

            // 2. Professor
            User professor = new User(
                    "prof@smartcollab.edu",
                    passwordEncoder.encode("Prof123!"),
                    "Karim",
                    "Benali",
                    Role.PROFESSOR
            );
            professor.setBio("Professeur en Génie Logiciel, responsable des Projets de Fin d'Études (PFE).");

            // 3. Admin
            User admin = new User(
                    "admin@smartcollab.edu",
                    passwordEncoder.encode("Admin123!"),
                    "Admin",
                    "SmartCollab",
                    Role.ADMIN
            );
            admin.setBio("Superviseur de la plateforme et gestionnaire du référentiel académique.");

            userRepository.saveAll(List.of(student, professor, admin));
            System.out.println("✅ [DataInitializer] Seeded 3 demo accounts (student, prof, admin)");
        }
    }
}
