package com.smartcollab.auth.config;

import com.smartcollab.auth.model.*;
import com.smartcollab.auth.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ProjectSubjectRepository subjectRepository;
    private final StudentGroupRepository groupRepository;
    private final SubjectApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           SkillRepository skillRepository,
                           ProjectSubjectRepository subjectRepository,
                           StudentGroupRepository groupRepository,
                           SubjectApplicationRepository applicationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.subjectRepository = subjectRepository;
        this.groupRepository = groupRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
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

        User hamza = userRepository.findByEmail("hamza.arhrid@emsi-edu.ma").orElse(null);
        if (hamza == null) {
            hamza = new User();
            hamza.setEmail("hamza.arhrid@emsi-edu.ma");
            hamza.setFirstName("Hamza");
            hamza.setLastName("Arhrid");
            hamza.setRole(Role.STUDENT);
        }
        hamza.setPasswordHash(passwordEncoder.encode("Student123!"));
        hamza.setStudentIdentifier("C-2025-000564");
        hamza.setMatricule("C-2025-000564");
        hamza.setFiliere("Ingénierie Informatique et Réseaux");
        hamza.setNiveau("5ème année");
        hamza.setClasseGroup("5DSIO G2 - G22");
        hamza.setCampus("CASA ORANGERS");
        hamza.setAcademicYear("2026-2027");
        hamza.setBio("Élève ingénieur en 5ème année IIR (5DSIO G2) à l'EMSI Les Orangers Casablanca. Spécialité Cloud-Native, DevOps et Full-Stack.");
        hamza = userRepository.save(hamza);
        System.out.println("✅ [DataInitializer] Seeded/Updated student: hamza.arhrid@emsi-edu.ma");

        User profKarim = userRepository.findByEmail("karim.benali@emsi-edu.ma").orElse(null);
        if (profKarim == null) {
            profKarim = new User();
            profKarim.setEmail("karim.benali@emsi-edu.ma");
            profKarim.setFirstName("Karim");
            profKarim.setLastName("Benali");
            profKarim.setRole(Role.PROFESSOR);
        }
        profKarim.setPasswordHash(passwordEncoder.encode("Prof123!"));
        profKarim.setFiliere("Ingénierie Informatique et Réseaux");
        profKarim.setCampus("CASA ORANGERS");
        profKarim.setBio("Professeur en Génie Logiciel, Cloud Computing et Architectures Distribuées. Responsable pédagogique des PFE.");
        profKarim = userRepository.save(profKarim);
        System.out.println("✅ [DataInitializer] Seeded/Updated professor: karim.benali@emsi-edu.ma");

        User adminEmsi = userRepository.findByEmail("admin@emsi-edu.ma").orElse(null);
        if (adminEmsi == null) {
            adminEmsi = new User();
            adminEmsi.setEmail("admin@emsi-edu.ma");
            adminEmsi.setFirstName("Direction");
            adminEmsi.setLastName("Pédagogique EMSI");
            adminEmsi.setRole(Role.ADMIN);
        }
        adminEmsi.setPasswordHash(passwordEncoder.encode("Admin123!"));
        adminEmsi.setCampus("CASA ORANGERS");
        adminEmsi.setBio("Administration centrale et coordination des projets de fin d'études EMSI.");
        adminEmsi = userRepository.save(adminEmsi);
        System.out.println("✅ [DataInitializer] Seeded/Updated admin: admin@emsi-edu.ma");

        User adminLegacy = userRepository.findByEmail("admin@smartcollab.edu").orElse(null);
        if (adminLegacy != null) {
            adminLegacy.setPasswordHash(passwordEncoder.encode("Admin123!"));
            userRepository.save(adminLegacy);
        }

        if (subjectRepository.count() == 0) {
            ProjectSubject pfe1 = new ProjectSubject(
                    "Conception & Déploiement d'une Architecture Microservices et CI/CD Cloud-Native",
                    ProjectType.PFE,
                    "Ingénierie Informatique et Réseaux",
                    "5ème année",
                    "Mise en place d'une infrastructure conteneurisée basée sur Spring Boot, Docker, Kubernetes, et observabilité complète avec Prometheus, Grafana et Loki.",
                    "Spring Boot, Kubernetes, Docker, Prometheus, Grafana, ArgoCD",
                    profKarim.getId(),
                    profKarim.getFirstName() + " " + profKarim.getLastName(),
                    profKarim.getEmail(),
                    2,
                    LocalDate.now().plusMonths(3)
            );
            pfe1.setObjectives("1. Architecture microservices résiliente\n2. Pipeline CI/CD GitOps automatisé\n3. Observabilité et alertes de production");

            ProjectSubject pfe2 = new ProjectSubject(
                    "Plateforme Intelligente d'Affectation PFE et de Matching de Compétences par IA",
                    ProjectType.PFE,
                    "Ingénierie Informatique et Réseaux",
                    "5ème année",
                    "Développement d'un moteur de recommandation basé sur le Traitement du Langage Naturel (NLP) et graphes de connaissances pour affecter équitablement les étudiants selon leurs aptitudes.",
                    "Python, FastAPI, React.js, PostgreSQL, PyTorch, Transformers",
                    profKarim.getId(),
                    profKarim.getFirstName() + " " + profKarim.getLastName(),
                    profKarim.getEmail(),
                    2,
                    LocalDate.now().plusMonths(3)
            );
            pfe2.setObjectives("1. Modèle NLP d'extraction de compétences\n2. Algorithme de Gale-Shapley adapté\n3. Tableau de bord interactif pour la commission");

            ProjectSubject pfe3 = new ProjectSubject(
                    "Système Distribué d'Analyse Temps Réel d'Anomalies Financières avec Kafka & Flink",
                    ProjectType.PFE,
                    "Ingénierie Informatique et Réseaux",
                    "5ème année",
                    "Traitement de flux de transactions financières haute vélocité avec détection d'anomalies en temps réel et stockage distribué.",
                    "Apache Kafka, Apache Flink, Java 21, ElasticSearch, Docker",
                    profKarim.getId(),
                    profKarim.getFirstName() + " " + profKarim.getLastName(),
                    profKarim.getEmail(),
                    1,
                    LocalDate.now().plusMonths(3)
            );

            ProjectSubject pfa1 = new ProjectSubject(
                    "Application Mobile & Web du Portail Étudiant EMSI (Emploi du temps & Absences)",
                    ProjectType.PFA,
                    "Ingénierie Informatique et Réseaux",
                    "4ème année",
                    "Développement d'une application unifiée pour la consultation des emplois du temps dynamiques, suivi des présences et notifications push.",
                    "React.js, Flutter, Spring Boot, PostgreSQL, Tailwind CSS",
                    profKarim.getId(),
                    profKarim.getFirstName() + " " + profKarim.getLastName(),
                    profKarim.getEmail(),
                    3,
                    LocalDate.now().plusMonths(2)
            );

            ProjectSubject pfa2 = new ProjectSubject(
                    "Système IoT de Surveillance Environnementale et Efficacité Énergétique des Campus EMSI",
                    ProjectType.PFA,
                    "Ingénierie Informatique et Réseaux",
                    "4ème année",
                    "Réseau de capteurs connectés en MQTT pour superviser la température, la qualité de l'air et la consommation électrique des salles de cours.",
                    "ESP32, MQTT, Node.js, InfluxDB, Grafana",
                    profKarim.getId(),
                    profKarim.getFirstName() + " " + profKarim.getLastName(),
                    profKarim.getEmail(),
                    2,
                    LocalDate.now().plusMonths(2)
            );

            subjectRepository.saveAll(List.of(pfe1, pfe2, pfe3, pfa1, pfa2));
            System.out.println("✅ [DataInitializer] Seeded 5 EMSI project subjects (PFE & PFA)");

            StudentGroup group = new StudentGroup(
                    "5DSIO Group Alpha",
                    "Ingénierie Informatique et Réseaux",
                    "5ème année",
                    hamza.getId(),
                    hamza.getFirstName() + " " + hamza.getLastName(),
                    hamza.getEmail(),
                    "[\"Hamza Arhrid (Leader)\", \"Omar Mansouri\", \"Sarah Tazi\"]"
            );
            groupRepository.save(group);
            System.out.println("✅ [DataInitializer] Seeded EMSI student group: 5DSIO Group Alpha");

            SubjectApplication application = new SubjectApplication(
                    pfe1.getId(),
                    pfe1.getTitle(),
                    hamza.getId(),
                    hamza.getFirstName() + " " + hamza.getLastName(),
                    hamza.getEmail(),
                    group.getId(),
                    group.getName(),
                    1,
                    "Nous sommes très motivés par l'architecture Cloud-Native et avons déjà une expérience en conteneurisation Docker et Kubernetes."
            );
            application.setStatus(ApplicationStatus.EN_ATTENTE);
            applicationRepository.save(application);
            System.out.println("✅ [DataInitializer] Seeded subject application for Hamza Arhrid");
        }
    }
}
