# 🎓 SmartCollab — Plateforme Microservices Intelligente de Gestion de Projets & Matching de Compétences

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.3-blue.svg)](https://spring.io/projects/spring-cloud)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Apache Kafka](https://img.shields.io/badge/Kafka-KRaft-black.svg)](https://kafka.apache.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 📑 Sommaire

1. [Vue d'Ensemble & Vision du Projet](#-1-vue-densemble--vision-du-projet)
2. [Architecture Microservices & Stack Technique](#-2-architecture-microservices--stack-technique)
3. [Entités & Modèle de Données Détaillé (ERD)](#-3-entités--modèle-de-données-détaillé-erd)
4. [Diagramme des Cas d'Utilisation UML (Use Cases)](#-4-diagramme-des-cas-dutilisation-uml-use-cases)
5. [Moteur Algorithmique de Matching de Compétences](#-5-moteur-algorithmique-de-matching-de-compétences)
6. [Spécification Complète des Dashboards par Rôle](#-6-spécification-complète-des-dashboards-par-rôle)
   - [6.1 Dashboard Étudiant (Student)](#61-dashboard-étudiant-student)
   - [6.2 Dashboard Professeur (Professor)](#62-dashboard-professeur-professor)
   - [6.3 Dashboard Administrateur (Admin)](#63-dashboard-administrateur-admin)
7. [Diagrammes de Séquence & Cycles de Vie](#-7-diagrammes-de-séquence--cycles-de-vie)
8. [Contrats d'APIs & Endpoints REST](#-8-contrats-dapis--endpoints-rest)
9. [Stratégie de Branches Git & Organisation du Projet](#-9-stratégie-de-branches-git--organisation-du-projet)
10. [Guide du Développeur & Répartition des Tâches Collaborateurs](#-10-guide-du-développeur--répartition-des-tâches-collaborateurs)
11. [Installation, Déploiement & Comptes de Démonstration](#-11-installation-déploiement--comptes-de-démonstration)

---

## 🌟 1. Vue d'Ensemble & Vision du Projet

**SmartCollab** est une plateforme académique cloud-native conçue pour résoudre l'un des problèmes majeurs de l'enseignement supérieur : **la constitution inefficace ou déséquilibrée des équipes d'étudiants pour les projets techniques**.

### Problématique Résolue :
Dans les cursus d'ingénierie et d'informatique, les projets complexes (Microservices, IA, Full-Stack, Cloud, DevOps) exigent un éventail diversifié de compétences. Les étudiants forment souvent leurs équipes par affinité personnelle, conduisant à des équipes homogènes (ex: 4 profils backend sans compétences frontend ou UI), provoquant des retards, des déséquilibres de charge de travail et des échecs de projet.

### Solution SmartCollab :
- **Profilage fin des compétences** : Chaque étudiant déclare ses compétences techniques avec un niveau d'expertise (1 à 5) et ses années d'expérience.
- **Définition granulaire des besoins de projet** : Les professeurs publient des projets assortis d'exigences techniques précises (niveaux requis, pondérations $w_i$, compétences obligatoires/veto).
- **Moteur d'adéquation pondérée (Skills Compatibility Engine)** : Évaluation automatique et en temps réel de l'adéquation d'une équipe avec un sujet, alertes sur les compétences manquantes et recommandations de coéquipiers.
- **Gestion du cycle de vie complet** : De la constitution d'équipe à la soumission, l'évaluation et la validation par l'enseignant.

---

## 🏛️ 2. Architecture Microservices & Stack Technique

Le projet adopte les principes du **Domain-Driven Design (DDD)**, la séparation stricte **Database-per-Service**, et une architecture orientée événements (**Event-Driven Architecture**) avec Apache Kafka.

### Diagramme d'Architecture Globale

```mermaid
flowchart TD
    Client["Client Web (React 18 SPA / Vite / Tailwind) :5173"]

    subgraph Infrastructure_Cloud["Infrastructure & Support Cloud-Native"]
        Eureka["Eureka Discovery Service :8761\n(Registre dynamique des instances)"]
        Config["Spring Cloud Config Server :8888\n(Configurations externalisées)"]
        Gateway["API Gateway :8080\n(Filtre JWT Réactif & Découverte Eureka)"]
        Kafka["Apache Kafka (KRaft Mode) :9092\nTopics: projects.v1, teams.v1"]
    end

    subgraph Microservices_Metier["Microservices Métier (DDD)"]
        AuthSvc["auth-service :8081\n(Utilisateurs, Rôles, Compétences)"]
        ProjSvc["project-service :8082\n(Sujets, Exigences, Quotas)"]
        MatchSvc["team-matching-service :8083\n(Équipes, Moteur Matching, Scores)"]
    end

    subgraph Bases_De_Donnees["Persistance (Database-per-Service)"]
        AuthDB[("PostgreSQL auth_db :5431")]
        ProjDB[("PostgreSQL project_db :5433")]
        MatchDB[("PostgreSQL team_matching_db :5434")]
    end

    Client -->|"HTTPS / REST (Bearer JWT)"| Gateway
    Gateway --> Eureka
    AuthSvc --> Eureka
    ProjSvc --> Eureka
    MatchSvc --> Eureka

    Gateway -->|"Headers: X-User-Id, X-User-Role\n/api/v1/auth/**, /api/v1/users/**"| AuthSvc
    Gateway -->|"/api/v1/projects/**"| ProjSvc
    Gateway -->|"/api/v1/teams/**, /api/v1/matching/**"| MatchSvc

    AuthSvc --- AuthDB
    ProjSvc --- ProjDB
    MatchSvc --- MatchDB

    ProjSvc -.->|"Kafka Event: ProjectCreatedEvent"| Kafka
    Kafka -.->|"Consumer: ProjectEventListener"| MatchSvc
    MatchSvc -->|"OpenFeign Inter-service (Profils & Skills)"| AuthSvc
    MatchSvc -->|"OpenFeign Inter-service (Exigences Projet)"| ProjSvc
```

### Inventaire des Services et Composants

| Composant | Technologie | Port | Description & Responsabilité |
| :--- | :--- | :--- | :--- |
| **`gateway-service`** | Spring Cloud Gateway, Reactive | `8080` | Point d'entrée unique (Reverse Proxy), validation des tokens JWT, extraction des en-têtes d'identité (`X-User-Id`, `X-User-Role`, `X-User-Email`), gestion centralisée des règles CORS. |
| **`discovery-service`** | Spring Cloud Netflix Eureka | `8761` | Service Registry permettant l'enregistrement et la résolution dynamique des instances sans IP codées en dur. |
| **`config-service`** | Spring Cloud Config Server | `8888` | Gestionnaire centralisé des configurations et profils applicatifs (`application.yml`) pour l'ensemble des microservices. |
| **`auth-service`** | Spring Boot, Spring Security, BCrypt | `8081` | Authentification, émission des JWT, gestion des utilisateurs (Étudiant, Professeur, Admin) et référentiel global des compétences (`skills`). |
| **`project-service`** | Spring Boot, Data JPA, Kafka Producer | `8082` | Gestion du cycle de vie des projets académiques, assignation des exigences de compétences pondérées, émission d'événements Kafka lors de la création d'un sujet. |
| **`team-matching-service`** | Spring Boot, OpenFeign, Kafka Consumer | `8083` | Gestion des équipes d'étudiants, calcul matriciel d'affinité algorithmique, stockage des scores et historiques de compatibilité. |
| **`common-dtos`** | Maven Module Java | — | Bibliothèque partagée contenant les DTOs communs (`UserDto`, `ProjectDto`, `MatchResultDto`, `TeamDto`) et les schémas d'événements Kafka. |
| **`frontend`** | React 18, Vite, Tailwind CSS, Lucide | `5173` | Interface utilisateur monopage réactive proposant les 3 espaces dédiés : Étudiant, Professeur et Administrateur. |
| **`Apache Kafka`** | Confluent Kafka 7.5.3 (KRaft) | `9092` | Broker d'événements asynchrones garantissant le découplage événementiel (ex: notifications de projet, changements d'équipe). |

---

## 🗄️ 3. Entités & Modèle de Données Détaillé (ERD)

La séparation en microservices impose une séparation stricte des schémas. Aucune contrainte de clé étrangère physique SQL n'existe entre différentes bases : les relations inter-services sont modélisées par des **UUIDs logiques** résolus via les APIs REST / OpenFeign.

### Diagramme Entité-Association Global (ERD)

```mermaid
erDiagram
    %% Auth Service DB
    USERS ||--o{ USER_SKILLS : "possede"
    SKILLS ||--o{ USER_SKILLS : "reference dans"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string role "STUDENT | PROFESSOR | ADMIN"
        string student_identifier UK
        text bio
        timestamp created_at
        timestamp updated_at
    }

    SKILLS {
        uuid id PK
        string name UK
        string category "BACKEND | FRONTEND | DEVOPS | DATA_AI | MOBILE | METHODOLOGY"
        text description
        timestamp created_at
    }

    USER_SKILLS {
        uuid user_id PK, FK
        uuid skill_id PK, FK
        int proficiency_level "CHECK: 1 a 5"
        numeric years_of_experience
    }

    %% Project Service DB
    PROJECTS ||--o{ PROJECT_REQUIREMENTS : "exige"

    PROJECTS {
        uuid id PK
        string title
        text description
        uuid professor_id "Logical FK -> auth_db.users"
        string status "DRAFT | PUBLISHED | ASSIGNED | COMPLETED | ARCHIVED"
        int min_team_size "CHECK: > 0"
        int max_team_size "CHECK: >= min_team_size"
        string academic_year
        timestamp submission_deadline
        timestamp created_at
        timestamp updated_at
    }

    PROJECT_REQUIREMENTS {
        uuid id PK
        uuid project_id FK
        uuid skill_id "Logical FK -> auth_db.skills"
        int minimum_level "CHECK: 1 a 5"
        numeric weight "CHECK: 0.1 a 1.0"
        boolean is_mandatory
    }

    %% Team Matching Service DB
    TEAMS ||--o{ TEAM_MEMBERS : "comprend"
    TEAMS ||--o{ MATCHING_SCORES : "evaluee par"

    TEAMS {
        uuid id PK
        string name UK
        uuid project_id "Logical FK -> project_db.projects"
        uuid leader_id "Logical FK -> auth_db.users"
        string status "FORMING | SUBMITTED | APPROVED | DISBANDED"
        timestamp created_at
        timestamp updated_at
    }

    TEAM_MEMBERS {
        uuid id PK
        uuid team_id FK
        uuid student_id "Logical FK -> auth_db.users"
        string role "LEADER | MEMBER"
        timestamp joined_at
    }

    MATCHING_SCORES {
        uuid id PK
        uuid team_id FK
        uuid project_id "Logical FK -> project_db.projects"
        numeric overall_score "CHECK: 0.00 a 100.00"
        boolean mandatory_skills_satisfied
        jsonb score_breakdown
        timestamp calculated_at
    }
```

### Détail des Entités par Base de Données

#### A. Base `auth_db` (Port: 5431)
1. **`users`** :
   - `id` (UUID, PK) : Identifiant unique de l'utilisateur.
   - `email` (VARCHAR 180, UNIQUE) : Identifiant de connexion institutionnel.
   - `password_hash` (VARCHAR 255) : Hash chiffré par BCrypt (ex: `$2a$10$...`).
   - `first_name` & `last_name` (VARCHAR 100) : Nom et prénom de l'utilisateur.
   - `role` (VARCHAR 30) : Rôle d'accès : `STUDENT`, `PROFESSOR`, ou `ADMIN`.
   - `student_identifier` (VARCHAR 50, UNIQUE, NULLABLE) : Numéro d'étudiant / CNE pour les élèves ingénieurs.
   - `bio` (TEXT) : Présentation personnelle, intérêts techniques et parcours.
   - `created_at` & `updated_at` (TIMESTAMP) : Audit temporel.
2. **`skills`** :
   - `id` (UUID, PK) : Identifiant de la compétence.
   - `name` (VARCHAR 100, UNIQUE) : Libellé standardisé (ex: `Java / Spring Boot`, `React.js`, `Docker & Kubernetes`, `Python / ML`).
   - `category` (VARCHAR 50) : Domaine technique (`BACKEND`, `FRONTEND`, `DEVOPS`, `DATA_AI`, `MOBILE`, `METHODOLOGY`).
   - `description` (TEXT) : Définition des compétences attendues.
3. **`user_skills`** (Table de jointure porteuse d'attributs) :
   - Clé composite (`user_id`, `skill_id`).
   - `proficiency_level` (INT, 1 à 5) : Niveau déclaré (1=Débutant, 2=Élémentaire, 3=Intermédiaire, 4=Avancé, 5=Expert).
   - `years_of_experience` (NUMERIC 3,1) : Années de pratique sur la technologie.

#### B. Base `project_db` (Port: 5433)
1. **`projects`** :
   - `id` (UUID, PK) : Identifiant du sujet académique.
   - `title` (VARCHAR 255) : Titre explicite du projet.
   - `description` (TEXT) : Cahier des charges, livrables attendus et contexte pédagogique.
   - `professor_id` (UUID) : Identifiant du professeur responsable (référence logique vers `auth_db.users`).
   - `status` (VARCHAR 30) : Statut : `DRAFT` (Brouillon), `PUBLISHED` (Ouvert aux candidatures), `ASSIGNED` (Équipe validée), `COMPLETED` (Terminé).
   - `min_team_size` & `max_team_size` (INT) : Encadrement de la taille du groupe (ex: min 2, max 4).
   - `academic_year` (VARCHAR 9) : Année universitaire de référence (ex: `2026-2027`).
   - `submission_deadline` (TIMESTAMP) : Date limite de candidature des équipes.
2. **`project_requirements`** :
   - `id` (UUID, PK) : Identifiant de l'exigence.
   - `project_id` (UUID, FK) : Clé étrangère vers `projects`.
   - `skill_id` (UUID) : Compétence requise (référence logique vers `auth_db.skills`).
   - `minimum_level` (INT, 1 à 5) : Niveau minimum exigé au sein de l'équipe.
   - `weight` (NUMERIC 3,2) : Coefficient de pondération dans le calcul du score (ex: 1.0 = critique, 0.5 = secondaire).
   - `is_mandatory` (BOOLEAN) : Si `true`, l'absence de ce niveau dans l'équipe déclenche un veto bloquant.

#### C. Base `team_matching_db` (Port: 5434)
1. **`teams`** :
   - `id` (UUID, PK) : Identifiant de l'équipe.
   - `name` (VARCHAR 120, UNIQUE) : Nom d'équipe choisi par les étudiants (ex: *CodeCrafters*).
   - `project_id` (UUID, NULLABLE) : Projet ciblé ou assigné (référence logique vers `project_db.projects`).
   - `leader_id` (UUID) : Étudiant créateur et chef d'équipe (référence logique vers `auth_db.users`).
   - `status` (VARCHAR 30) : Statut : `FORMING` (En cours de constitution), `SUBMITTED` (Candidature déposée), `APPROVED` (Validée par l'enseignant), `DISBANDED` (Dissoute).
2. **`team_members`** :
   - `id` (UUID, PK) : Identifiant de l'adhésion.
   - `team_id` (UUID, FK) : Équipe concernée.
   - `student_id` (UUID) : Étudiant membre de l'équipe (référence logique vers `auth_db.users`).
   - `role` (VARCHAR 30) : Rôle au sein du groupe (`LEADER` ou `MEMBER`).
   - `joined_at` (TIMESTAMP) : Date d'intégration.
3. **`matching_scores`** :
   - `id` (UUID, PK) : Identifiant du résultat calculé.
   - `team_id` (UUID, FK) : Équipe évaluée.
   - `project_id` (UUID) : Projet évalué.
   - `overall_score` (NUMERIC 5,2) : Score global d'adéquation en pourcentage (0.00% à 100.00%).
   - `mandatory_skills_satisfied` (BOOLEAN) : `true` si tous les prérequis obligatoires sont satisfaits.
   - `score_breakdown` (JSONB) : Détail complet pour chaque compétence (niveau d'équipe max, ratio obtenu, statut bloquant).

---

## 🎯 4. Diagramme des Cas d'Utilisation UML (Use Cases)

Le diagramme ci-dessous modélise les interactions complètes entre les acteurs humains (**Étudiant**, **Professeur**, **Administrateur**), le sous-système de calcul (**Moteur Algorithmique**), ainsi que les relations de dépendance fonctionnelle standard **`«include»`** (inclusions systématiques) et **`«extend»`** (extensions conditionnelles déclenchées sous conditions spécifiques).

### Diagramme de Cas d'Utilisation Global

```mermaid
flowchart LR
    subgraph Acteurs["👥 Acteurs du Système"]
        Etu["🎓 Étudiant (STUDENT)"]
        Prof["👨‍🏫 Professeur (PROFESSOR)"]
        Admin["🛡️ Administrateur (ADMIN)"]
        System["⚙️ Moteur Algorithmique (Système)"]
    end

    subgraph Module_Securite["🔐 Module Sécurité & Profil"]
        UC_Login(["S'authentifier (JWT)"])
        UC_Profile(["Gérer son profil & bio"])
        UC_Skills(["Déclarer compétences (1 à 5)"])
        UC_Radar(["Visualiser Radar de compétences"])
    end

    subgraph Module_Projets["📁 Module Gestion des Sujets"]
        UC_CreateProj(["Publier un sujet de projet"])
        UC_DefReq(["Définir exigences pondérées (w_i)"])
        UC_SetVeto(["Activer critère obligatoire (Veto)"])
        UC_BrowseProj(["Consulter catalogue des sujets"])
        UC_LockProj(["Verrouiller le sujet (Statut ASSIGNED)"])
    end

    subgraph Module_Equipes["👥 Module Constitution & Matching"]
        UC_CreateTeam(["Créer une équipe (Leader)"])
        UC_InviteMember(["Inviter / Ajouter des membres"])
        UC_CheckTeamSize(["Contrôler quotas taille (min/max)"])
        UC_SimMatch(["Simuler matching équipe-projet"])
        UC_CalcScore(["Calculer score adéquation pondéré"])
        UC_RecruitHelp(["Suggérer profils à recruter"])
        UC_SubmitTeam(["Déposer candidature de l'équipe"])
    end

    subgraph Module_Revue["📋 Module Revue & Décision Enseignant"]
        UC_ReviewTeams(["Consulter classement des équipes"])
        UC_InspectBreakdown(["Analyser décomposition (Breakdown)"])
        UC_ValidateTeam(["Approuver l'équipe candidate"])
        UC_RejectTeam(["Rejeter candidature avec motif"])
    end

    subgraph Module_Admin["⚙️ Module Administration & Supervision"]
        UC_ManageUsers(["Gérer les utilisateurs (CRUD)"])
        UC_ImportCSV(["Importer étudiants par lot (CSV)"])
        UC_ManageSkills(["Gérer catalogue des compétences"])
        UC_MonitorSystem(["Surveiller santé microservices"])
    end

    %% Associations Acteurs -> Cas d'utilisation principaux
    Etu --> UC_Login
    Etu --> UC_Profile
    Etu --> UC_Skills
    Etu --> UC_BrowseProj
    Etu --> UC_CreateTeam
    Etu --> UC_SimMatch
    Etu --> UC_SubmitTeam

    Prof --> UC_Login
    Prof --> UC_Profile
    Prof --> UC_CreateProj
    Prof --> UC_ReviewTeams
    Prof --> UC_ValidateTeam
    Prof --> UC_RejectTeam

    Admin --> UC_Login
    Admin --> UC_ManageUsers
    Admin --> UC_ManageSkills
    Admin --> UC_MonitorSystem

    %% Relations «include» (Inclusions obligatoires)
    UC_Profile -.->|"«include»"| UC_Login
    UC_Skills -.->|"«include»"| UC_Login
    UC_CreateProj -.->|"«include»"| UC_Login
    UC_CreateProj -.->|"«include»"| UC_DefReq
    UC_CreateTeam -.->|"«include»"| UC_Login
    UC_CreateTeam -.->|"«include»"| UC_InviteMember
    UC_SubmitTeam -.->|"«include»"| UC_CheckTeamSize
    UC_SimMatch -.->|"«include»"| UC_CalcScore
    UC_CalcScore --- System
    UC_ReviewTeams -.->|"«include»"| UC_InspectBreakdown
    UC_ValidateTeam -.->|"«include»"| UC_Login
    UC_ManageUsers -.->|"«include»"| UC_Login
    UC_ManageSkills -.->|"«include»"| UC_Login

    %% Relations «extend» avec Points d'Extension & Conditions explicites
    UC_Radar -.->|"«extend» [Condition: Profil complété]"| UC_Skills
    UC_SetVeto -.->|"«extend» [Condition: Compétence critique]"| UC_DefReq
    UC_RecruitHelp -.->|"«extend» [Condition: Veto activé ou Score < 70%]"| UC_SimMatch
    UC_LockProj -.->|"«extend» [Condition: Quota max validé atteint]"| UC_ValidateTeam
    UC_ImportCSV -.->|"«extend» [Condition: Fichier CSV conforme]"| UC_ManageUsers
```

### Grille d'Analyse des Relations Use Case

| Cas d'Utilisation Source | Relation | Cas d'Utilisation Cible | Condition d'Extension / Déclencheur |
| :--- | :--- | :--- | :--- |
| **`UC_Skills` (Déclarer compétences)** | `«include»` | **`UC_Login`** | Un token JWT valide avec rôle `STUDENT` est obligatoire. |
| **`UC_Radar` (Visualiser Radar)** | `«extend»` | **`UC_Skills`** | Condition : Déclenché lorsque l'étudiant a renseigné au moins 3 compétences. |
| **`UC_CreateProj` (Publier sujet)** | `«include»` | **`UC_DefReq`** | Tout projet exige obligatoirement au moins une compétence pondérée ($w_i > 0$). |
| **`UC_SetVeto` (Activer veto)** | `«extend»` | **`UC_DefReq`** | Condition : L'enseignant coche l'exigence comme critique (`isMandatory = true`). |
| **`UC_SubmitTeam` (Candidater)** | `«include»` | **`UC_CheckTeamSize`**| Vérifie que l'équipe respecte : $\text{minTeamSize} \le |\text{membres}| \le \text{maxTeamSize}$. |
| **`UC_SimMatch` (Simuler)** | `«include»` | **`UC_CalcScore`** | Exécution systématique du `SkillMatchingEngine` par le backend. |
| **`UC_RecruitHelp` (Recommandation)**| `«extend»` | **`UC_SimMatch`** | Condition : Déclenché si une compétence obligatoire manque ou si le score est insuffisant. |
| **`UC_LockProj` (Verrouiller projet)** | `«extend»` | **`UC_ValidateTeam`**| Condition : Déclenché automatiquement lorsque le nombre d'équipes approuvées atteint le quota. |
| **`UC_ImportCSV` (Import en masse)** | `«extend»` | **`UC_ManageUsers`**| Condition : Déclenché si l'administrateur téléverse un fichier CSV institutionnel. |

---

## ⚙️ 5. Moteur Algorithmique de Matching de Compétences

Le cœur d'innovation de SmartCollab repose sur le composant **`SkillMatchingEngine`**.

### 1. Calcul du Niveau d'Équipe pour une Compétence
Pour une compétence requise $s$, le niveau disponible au sein de l'équipe est déterminé par le niveau maximal détenu par l'un des membres de l'équipe :

$$L_{team}(s) = \max_{m \in \text{Membres}} \left( \text{Niveau}(m, s) \right)$$

*Remarque : Si aucun membre de l'équipe ne possède cette compétence, $L_{team}(s) = 0$.*

### 2. Calcul du Ratio de Satisfaction
Pour chaque compétence requise $s_i$ exigeant un niveau minimum $L_{req}(s_i)$ :

$$\text{Ratio}(s_i) = \min\left(1.0, \frac{L_{team}(s_i)}{L_{req}(s_i)}\right)$$

### 3. Calcul du Score Global Pondéré
Le score global d'adéquation (exprimé en pourcentage de 0 à 100) est la moyenne pondérée par les poids $w_i$ des exigences du projet :

$$\text{Score Global} = \frac{\sum_{i=1}^{n} w_i \times \text{Ratio}(s_i)}{\sum_{i=1}^{n} w_i} \times 100$$

### 4. Règle de Veto et Classification des Équipes

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        ÉVALUATION DE COMPATIBILITÉ                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  Y a-t-il une compétence obligatoire    
                  (isMandatory = true) avec L_team < L_req ?
                                    │
                   ┌────────────────┴────────────────┐
                 OUI                                NON
                   │                                 │
                   ▼                                 ▼
      [BLOCKED_MANDATORY_MISSING]        Évaluation selon le Score :
      - Statut non éligible              - Score >= 85% : [EXCELLENT] (Idéal)
      - Liste explicite des manques      - Score >= 70% : [GOOD] (Équilibré)
      - Suggestion de profils à recruter - Score >= 50% : [MODERATE] (Moyen)
                                         - Score <  50% : [INSUFFICIENT] (Inadéquat)
```

---

## 🖥️ 6. Spécification Complète des Dashboards par Rôle

Chaque utilisateur accède à un espace personnalisé selon son rôle JWT (`STUDENT`, `PROFESSOR`, `ADMIN`).

```mermaid
flowchart LR
    subgraph Acteurs["Acteurs du Système"]
        Etu["Étudiant (STUDENT)"]
        Prof["Professeur (PROFESSOR)"]
        Admin["Administrateur (ADMIN)"]
    end

    subgraph Espaces["Espaces Dédiés (Front-End)"]
        DashEtu["Dashboard Étudiant\n- Profil & Radar de Compétences\n- Mes Équipes & Invitations\n- Catalogue Sujets & Matching Studio\n- Candidatures & Résultats"]
        DashProf["Dashboard Professeur\n- Création & Gestion des Sujets\n- Configuration des Exigences & Veto\n- Revue des Équipes Candidates\n- Validation / Refus & Suivi"]
        DashAdmin["Dashboard Administrateur\n- Statistiques & Métriques Globales\n- Gestion des Utilisateurs (CRUD)\n- Référentiel des Compétences\n- Paramétrage des Campagnes"]
    end

    Etu --> DashEtu
    Prof --> DashProf
    Admin --> DashAdmin
```

---

### 6.1 Dashboard Étudiant (Student)

L'espace de l'étudiant est centré sur la valorisation de son profil, la formation de son équipe et l'analyse de compatibilité avec les sujets proposés.

#### Composants Clés & Fonctionnalités :
1. **Fiche Profil & Compétences Personnelles** :
   - Déclaration et mise à jour de ses compétences parmi le catalogue standardisé.
   - Pour chaque compétence : choix du niveau d'expertise (étoiles de 1 à 5) et années de pratique.
   - Visualisation sous forme de **Diagramme Radar** mettant en valeur ses forces (ex: Backend 5/5, DevOps 4/5).
   - Bio et numéro d'étudiant (`student_identifier`).

2. **Espace « Mon Équipe »** :
   - **Mode Leader** : Créer une équipe, choisir le nom, rechercher des camarades par email ou nom, envoyer des invitations, désigner les rôles (`LEADER`, `MEMBER`).
   - **Mode Membre** : Consulter son équipe active, voir les autres membres et leurs compétences combinées.
   - **Matrice des Compétences d'Équipe** : Tableau croisé récapitulant les forces du groupe et identifiant les points faibles (lacunes en UI, en déploiement, etc.).

3. **Catalogue des Projets & Matching Studio** :
   - Liste des projets ouverts avec filtres par technologie ou professeur.
   - **Simulateur de Matching en temps réel** : L'étudiant sélectionne son équipe et un projet :
     - Affichage du Score Global (% de compatibilité).
     - Badge visuel : `EXCELLENT`, `GOOD`, `MODERATE` ou `BLOCKED`.
     - Tableau détaillé compétence par compétence : Niveau de l'équipe vs Niveau exigé par le professeur, coefficient de poids, indicateur de veto.
     - **Assistant de recrutement prédictif** : Si une compétence obligatoire manque, le studio suggère le profil type à recruter pour débloquer la candidature.

4. **Suivi des Candidatures** :
   - Statut de la candidature de l'équipe (`EN ATTENTE`, `APPROUVÉE`, `REFUSÉE`).
   - Consultation des retours ou remarques du professeur encadrant.

---

### 6.2 Dashboard Professeur (Professor)

L'espace du professeur lui permet d'encadrer les projets, de formaliser avec précision ses attentes techniques et de sélectionner les équipes les plus compétentes de manière objective.

#### Composants Clés & Fonctionnalités :
1. **Atelier de Conception de Sujets (Project Studio)** :
   - Formulaire de création de projet : Titre, description détaillée, livrables attendus, année académique, date limite de soumission.
   - Définition des quotas : Nombre d'étudiants minimum et maximum par groupe (ex: 3 à 4).
   - **Éditeur d'Exigences Techniques Avancées** :
     - Ajout de compétences depuis le catalogue.
     - Définition du niveau minimum requis (1 à 5).
     - Définition de la pondération (ex: `1.0` pour la techno principale, `0.5` pour les outils secondaires).
     - Bascule **Critère Obligatoire (Veto)** : coche pour rendre la compétence bloquante.
   - Enregistrement en brouillon (`DRAFT`) ou publication immédiate (`PUBLISHED`).

2. **Tableau de Bord des Candidatures & Équipes** :
   - Vue Kanban ou tabulaire des équipes ayant postulé à chaque projet du professeur.
   - Classement automatique des équipes par **Score de Matching décroissant**.
   - Alerte visuelle immédiate sur les équipes en veto (`BLOCKED_MANDATORY_MISSING`) avec le détail des compétences défaillantes.
   - Vue détaillée de la composition de chaque équipe (noms des étudiants, niveaux individuels et cumulés).

3. **Centre de Décision & Validation** :
   - Boutons d'action rapide : **Valider l'équipe (`APPROVE`)** ou **Refuser (`REJECT`)**.
   - En cas d'approbation : clôture automatique ou décrémentation des places disponibles sur le sujet, et notification aux étudiants.
   - Export récapitulatif de la composition finale des groupes (CSV / PDF).

---

### 6.3 Dashboard Administrateur (Admin)

L'espace administrateur assure la gouvernance de la plateforme, la gestion des référentiels, la sécurité et le monitoring des flux système.

#### Composants Clés & Fonctionnalités :
1. **Indicateurs Clés & Statistiques Générales (KPIs)** :
   - Nombre total d'étudiants inscrits, de professeurs actifs et de projets publiés.
   - Nombre d'équipes formées et pourcentage d'étudiants ayant trouvé une équipe complète.
   - Taux moyen d'adéquation des équipes (score moyen de matching).
   - Graphique de répartition des compétences les plus demandées vs les plus disponibles sur le campus.

2. **Gestion des Utilisateurs & Attribution des Rôles** :
   - Annuaire complet avec recherche textuelle et filtrage par rôle (`STUDENT`, `PROFESSOR`, `ADMIN`).
   - Création manuelle d'utilisateurs ou import massif d'étudiants via fichier CSV/Excel.
   - Modification des rôles, réinitialisation de mots de passe et désactivation de comptes.

3. **Gouvernance du Catalogue des Compétences (Taxonomie)** :
   - Ajout, modification et archivage des compétences disponibles sur la plateforme.
   - Organisation par catégories (`BACKEND`, `FRONTEND`, `DEVOPS`, `DATA_AI`, `MOBILE`, `METHODOLOGY`).
   - Normalisation des intitulés pour éviter les doublons (ex: regrouper `React` et `ReactJS`).

4. **Monitoring & Santé de l'Écosystème Microservices** :
   - État de santé des instances enregistrées sur Eureka (`UP` / `DOWN`).
   - Surveillance de l'état des 3 bases de données PostgreSQL.
   - Suivi de la connectivité du cluster Kafka et des topics actifs (`smartcollab.projects.v1`, etc.).

---

## 🔄 7. Diagrammes de Séquence & Cycles de Vie

### Diagramme de Séquence Événementiel avec Alternatives (Alt / Else)

Ce diagramme illustre le parcours de bout en bout avec gestion des cas de succès, des blocages de veto et des décisions d'arbitrage de l'enseignant.

```mermaid
sequenceDiagram
    autonumber
    actor Prof as 👨‍🏫 Professeur
    actor EtuLeader as 🎓 Étudiant (Leader)
    participant Front as 💻 Frontend React SPA (:5173)
    participant Gateway as 🚪 API Gateway (:8080)
    participant AuthSvc as 🔐 auth-service (:8081)
    participant ProjSvc as 📁 project-service (:8082)
    participant MatchSvc as ⚙️ team-matching-service (:8083)
    participant Kafka as 📨 Apache Kafka (:9092)

    Note over Prof, ProjSvc: Phase 1 : Publication du Sujet avec Exigences & Veto
    Prof->>Front: Saisie du projet + compétences requises (poids w_i, isMandatory)
    Front->>Gateway: POST /api/v1/projects (Bearer JWT)
    Gateway->>Gateway: Valide JWT & extrait (X-User-Id, X-User-Role=PROFESSOR)
    Gateway->>ProjSvc: Reroute requête avec en-têtes d'identité
    ProjSvc->>ProjSvc: Sauvegarde projet & contraintes dans project_db
    ProjSvc->>Kafka: Publie ProjectCreatedEvent (Topic: smartcollab.projects.v1)
    ProjSvc-->>Front: 201 Created (ProjectDto)
    Kafka-->>MatchSvc: Consomme événement (Mise en cache du nouveau sujet)

    Note over EtuLeader, MatchSvc: Phase 2 : Constitution de l'Équipe & Candidature
    EtuLeader->>Front: Crée l'équipe 'CodeCrafters' & ajoute les étudiants
    Front->>Gateway: POST /api/v1/teams
    Gateway->>MatchSvc: Reroute avec X-User-Id du leader
    MatchSvc->>MatchSvc: Enregistre équipe (Statut: FORMING) dans team_matching_db
    MatchSvc-->>Front: 201 Created (TeamDto)

    Note over EtuLeader, MatchSvc: Phase 3 : Calcul Algorithmique de Matching
    EtuLeader->>Front: Lance la simulation d'affinité pour le projet
    Front->>Gateway: POST /api/v1/matching/calculate?teamId=...&projectId=...
    Gateway->>MatchSvc: Reroute vers MatchingController
    MatchSvc->>ProjSvc: GET /api/v1/projects/{id} (via OpenFeign)
    ProjSvc-->>MatchSvc: Exigences techniques {skillId, minLevel, weight, isMandatory}
    loop Pour chaque membre de l'équipe
        MatchSvc->>AuthSvc: GET /api/v1/users/{memberId} (via OpenFeign)
        AuthSvc-->>MatchSvc: Profil & matrice de compétences {skillId, level}
    end
    MatchSvc->>MatchSvc: Exécute SkillMatchingEngine : L_team = max(niveau)

    alt Compétences obligatoires satisfaites (isMandatory = true et L_team >= L_req)
        MatchSvc->>MatchSvc: Calcule Score Global Pondéré (0 à 100%)
        MatchSvc->>MatchSvc: Attribue statut (EXCELLENT, GOOD ou MODERATE)
    else Compétence obligatoire manquante (L_team < L_req)
        MatchSvc->>MatchSvc: Déclenche Veto : statut BLOCKED_MANDATORY_MISSING
        MatchSvc->>MatchSvc: Identifie les compétences bloquantes et profils à recruter
    end
    MatchSvc->>MatchSvc: Sauvegarde score & breakdown JSONB dans matching_scores
    MatchSvc-->>Front: 200 OK (MatchResultDto)

    Note over EtuLeader, Prof: Phase 4 : Soumission et Décision Enseignant
    EtuLeader->>Front: Valide et soumet la candidature de l'équipe
    Front->>Gateway: PUT /api/v1/teams/{id}/submit
    Gateway->>MatchSvc: Statut passe à SUBMITTED
    Prof->>Front: Ouvre son Dashboard Professeur
    Front->>Gateway: GET /api/v1/matching/project/{projectId}
    Gateway->>MatchSvc: Récupère les équipes candidates ordonnées par score
    MatchSvc-->>Front: Classement des équipes (Scores, Statuts, Veto)

    alt Le professeur approuve l'équipe
        Prof->>Front: Clique sur 'Approuver la candidature'
        Front->>Gateway: PUT /api/v1/teams/{id}/approve
        Gateway->>MatchSvc: Statut mis à APPROVED
        MatchSvc->>Kafka: Publie TeamApprovedEvent
        Kafka-->>ProjSvc: Consomme événement & vérifie quotas
        MatchSvc-->>Front: Confirmation validation (200 OK)
    else Le professeur refuse ou demande un réajustement
        Prof->>Front: Clique sur 'Rejeter avec motif'
        Front->>Gateway: PUT /api/v1/teams/{id}/reject
        Gateway->>MatchSvc: Statut remis à FORMING (Ajustement requis)
        MatchSvc-->>Front: Notification transmise à l'équipe
    end
```

### Diagramme d'États : Cycles de Vie Projet et Équipe

```mermaid
stateDiagram-v2
    direction TB

    state "Cycle de Vie d'un Projet Académique" as ProjModel {
        [*] --> DRAFT : Création par l'enseignant
        DRAFT --> PUBLISHED : Validation des exigences & quotas
        PUBLISHED --> ASSIGNED : Équipe candidate approuvée
        ASSIGNED --> IN_PROGRESS : Démarrage du semestre
        IN_PROGRESS --> COMPLETED : Soutenance et évaluation finale
        COMPLETED --> ARCHIVED : Fin d'année universitaire
        PUBLISHED --> CANCELLED : Annulation par l'enseignant
    }

    state "Cycle de Vie d'une Équipe Étudiante" as TeamModel {
        [*] --> FORMING : Création par le leader
        FORMING --> FORMING : Ajout / Retrait de membres
        FORMING --> SUBMITTED : Candidature déposée (Taille min/max valide)
        SUBMITTED --> APPROVED : Validation par l'enseignant (Score suffisant)
        SUBMITTED --> FORMING : Refus avec motif (Réajustement compétences)
        FORMING --> DISBANDED : Dissolution volontaire
        APPROVED --> COMPLETED_TEAM : Projet soutenu et validé
    }
```

---

## 📡 8. Contrats d'APIs & Endpoints REST

Toutes les requêtes passent par l'API Gateway sur le port **`8080`**.

### 1. Service d'Authentification & Utilisateurs (`auth-service`)

| Méthode | Endpoint Gateway | Rôle Minimum | Description | Corps de Requête / Réponse Clé |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Connexion et obtention du JWT | Req: `{ email, password }`<br>Res: `{ token, user: { id, email, role, ... } }` |
| `GET` | `/api/v1/users/me` | Authentifié | Profil de l'utilisateur connecté | En-tête : `Authorization: Bearer <token>` |
| `GET` | `/api/v1/users/{id}` | Authentifié | Profil détaillé d'un utilisateur | Res: `UserDto` (avec `skills[]`) |
| `GET` | `/api/v1/users/students` | Authentifié | Liste de tous les étudiants | Res: `List<UserDto>` |
| `GET` | `/api/v1/skills` | Public / Auth | Catalogue global des compétences | Res: `List<SkillDto>` |
| `POST` | `/api/v1/skills` | `ADMIN` | Ajout d'une nouvelle compétence | Req: `{ name, category, description }` |

### 2. Service de Gestion des Projets (`project-service`)

| Méthode | Endpoint Gateway | Rôle Minimum | Description | Corps de Requête / Réponse Clé |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/projects` | Authentifié | Liste de tous les projets publiés | Res: `List<ProjectDto>` |
| `GET` | `/api/v1/projects/{id}` | Authentifié | Détails d'un projet et ses exigences | Res: `ProjectDto` (avec `requirements[]`) |
| `GET` | `/api/v1/projects/professor/{profId}` | `PROFESSOR`, `ADMIN` | Projets créés par un professeur | Res: `List<ProjectDto>` |
| `POST` | `/api/v1/projects` | `PROFESSOR`, `ADMIN` | Création d'un nouveau projet | Req: `ProjectDto` (titre, desc, quotas, requirements[]) |

### 3. Service d'Équipes & Matching (`team-matching-service`)

| Méthode | Endpoint Gateway | Rôle Minimum | Description | Corps de Requête / Réponse Clé |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/teams` | Authentifié | Liste de toutes les équipes | Res: `List<TeamDto>` |
| `GET` | `/api/v1/teams/{id}` | Authentifié | Détail d'une équipe et ses membres | Res: `TeamDto` (avec `members[]`) |
| `POST` | `/api/v1/teams` | `STUDENT` | Création d'une nouvelle équipe | Req: `{ name, projectId? }` |
| `POST` | `/api/v1/teams/{id}/members/{studentId}` | `STUDENT` | Ajout d'un étudiant dans l'équipe | Path params : `id`, `studentId` |
| `POST` | `/api/v1/matching/calculate` | Authentifié | Calcul d'affinité d'équipe | Query params: `teamId`, `projectId`<br>Res: `MatchResultDto` |
| `GET` | `/api/v1/matching/project/{projectId}` | `PROFESSOR`, `ADMIN` | Scores de toutes les équipes candidates | Res: `List<MatchingScore>` |

---

## 🌿 9. Stratégie de Branches Git & Organisation du Projet

Pour garantir une collaboration sans heurt et éviter la dispersion du code dans des dizaines de branches éphémères, le repository GitHub est structuré autour de **3 branches principales d'équipe** en plus de la branche `main` :

```mermaid
gitGraph
    commit id: "Initial Documentation"
    branch devops
    branch backend
    branch frontend
    checkout frontend
    commit id: "React UI & Dashboards"
    checkout backend
    commit id: "Spring Boot Microservices"
    checkout devops
    commit id: "Docker Compose & Kafka"
    checkout main
    merge backend id: "Merge Backend v1.0"
    merge frontend id: "Merge Frontend v1.0"
    merge devops id: "Release Production"
```

### Rôle et Périmètre des Branches Principales

| Branche Git | Équipe Responsable | Périmètre Technique & Dossiers Dédiés |
| :--- | :--- | :--- |
| 🛡️ **`main`** | **Toute l'équipe** | Branche de référence stable / production. Elle contient la documentation maîtresse ([README.md](file:///home/arhrid-hamza/SmartCollab/README.md)) et reçoit uniquement les fusions validées (Pull Requests) des branches `backend`, `frontend` et `devops`. |
| 💻 **`frontend`** | **Équipe Front-End** | Développement de l'interface monopage React 18, Tailwind CSS, Lucide icons, formulaires, diagrammes Radar et dashboards Étudiant/Professeur/Admin (Dossier : `frontend/`). |
| ⚙️ **`backend`** | **Équipe Back-End** | Développement de l'ensemble des microservices Spring Boot (`auth-service`, `project-service`, `team-matching-service`, `gateway-service`, `discovery-service`, `config-service`) et du module partagé (`common-dtos`). |
| 🐳 **`devops`** | **Équipe Infrastructure**| Scripts de déploiement, orchestration `docker-compose.yml`, bases PostgreSQL indépendantes, cluster Apache Kafka KRaft et configurations de pipelines (Dossiers : `docker/`, `scripts/`). |

### Workflow de Développement au Quotidien (Feature Branches)

Chaque collaborateur travaille selon le principe du **Feature Branching** rattaché à son pôle :
1. **Cloner le repository** :
   ```bash
   git clone https://github.com/Arhrid-Hamza/SmartCollab.git
   cd SmartCollab
   ```
2. **Basculer sur sa branche de pôle** (`backend` ou `frontend`) :
   ```bash
   git checkout backend
   # ou : git checkout frontend
   ```
3. **Créer une branche de tâche spécifique** :
   ```bash
   git checkout -b feat/nom-de-votre-fonctionnalite
   ```
4. **Développer, committer et pousser** :
   ```bash
   git add .
   git commit -m "feat(module): description claire du changement"
   git push -u origin feat/nom-de-votre-fonctionnalite
   ```
5. **Ouvrir une Pull Request (PR)** sur GitHub vers sa branche de pôle (`backend` ou `frontend`). Une fois validée par les pairs, la fusion s'effectue vers `main`.

---

## 👥 10. Guide du Développeur & Répartition des Tâches Collaborateurs

```mermaid
flowchart TD
    subgraph Collab_Front["Équipe Front-End (Branche : frontend)"]
        F1["Chantier F1 : Dashboard Étudiant\n- Profil, radar de compétences & bio\n- Gestion de l'équipe & invitations\n- Studio de matching interactif"]
        F2["Chantier F2 : Dashboard Professeur\n- Création de projets & quotas d'équipe\n- Constructeur d'exigences & veto\n- Revue et approbation des candidatures"]
        F3["Chantier F3 : Console Administrateur\n- Gestion des comptes et des rôles\n- Taxonomie des compétences globales\n- Monitoring système & santé microservices"]
    end

    subgraph Collab_Back["Équipe Back-End (Branche : backend)"]
        B1["Chantier B1 : auth-service & common-dtos\n- Modèle de données User & Skills\n- Endpoints JWT, sécurité & filtres Gateway\n- DTOs partagés inter-services"]
        B2["Chantier B2 : project-service\n- Gestion du cycle de vie des sujets\n- Quotas min/max d'équipe et deadlines\n- Émission d'événements Kafka"]
        B3["Chantier B3 : team-matching-service\n- Moteur SkillMatchingEngine & Veto\n- Clients OpenFeign synchrones\n- Stockage JSONB des breakdowns"]
    end

    subgraph Collab_DevOps["Équipe DevOps (Branche : devops)"]
        D1["Chantier D1 : Conteneurisation & DBs\n- Configuration Docker Compose multi-DBs\n- Scripts SQL initiaux (auth, project, team)\n- Broker Apache Kafka en mode KRaft"]
    end
```

### Matrice RACI des Tâches Techniques

| Pôle / Branche | Fonctionnalité Clé | Tâche Développeur Précise | Fichiers Cibles Clés |
| :--- | :--- | :--- | :--- |
| **`frontend`** | **Profil & Compétences** | Créer la page de profil étudiant avec sliders de niveau (1-5) et graphique Radar. | `frontend/src/pages/ProfilePage.jsx` |
| **`frontend`** | **Gestion d'Équipe UI** | Interface de recherche de coéquipiers et gestion des statuts de l'équipe. | `frontend/src/pages/TeamsPage.jsx` |
| **`frontend`** | **Studio Sujets Professeur** | Interface dynamique d'ajout d'exigences avec toggle `isMandatory` et sliders de poids. | `frontend/src/pages/ProfessorStudioPage.jsx` |
| **`frontend`** | **Console Administration UI** | Tableaux de bord Admin avec gestion des rôles et catalogue des compétences. | `frontend/src/pages/AdminDashboardPage.jsx` |
| **`backend`** | **Endpoints Admin Backend** | Ajouter les endpoints d'administration des utilisateurs et des rôles dans `auth-service`. | `UserController.java`, `SkillController.java` |
| **`backend`** | **Workflow d'Approbation** | Implémenter les statuts de candidature et le verrouillage de projet dans `project-service`. | `ProjectService.java`, `Project.java` |
| **`backend`** | **Algorithme & Suggestion** | Étendre `SkillMatchingEngine` pour suggérer les profils idéaux manquants à une équipe. | `SkillMatchingEngine.java`, `MatchingService.java` |
| **`backend`** | **Événements Asynchrones** | Finaliser les producteurs/consommateurs Kafka pour la synchronisation inter-services. | `ProjectEventListener.java`, `TeamFormedEvent.java` |
| **`devops`** | **Infrastructure & Conteneurs**| Finaliser l'orchestration des 3 bases de données PostgreSQL et du broker Kafka. | `docker/docker-compose.yml`, `init-sql/` |

---

## 🚀 11. Installation, Déploiement & Comptes de Démonstration

### Prérequis Système
- **Java** : JDK 21 LTS
- **Maven** : Version 3.9+
- **Node.js** : Version 20+ et `npm`
- **Docker** : Docker Desktop / Docker Engine avec plugin Docker Compose

---

### Étape 1 : Démarrage des Bases de Données & Kafka via Docker
Lancez les conteneurs PostgreSQL indépendants et le broker Kafka :
```bash
docker compose -f docker/docker-compose.yml up -d
```
*Vérifiez que tous les conteneurs sont `healthy` :*
```bash
docker compose -f docker/docker-compose.yml ps
```

---

### Étape 2 : Compilation du Backend
Compilez l'ensemble des modules Maven à la racine du projet :
```bash
mvn clean package -DskipTests -f backend/pom.xml
```

---

### Étape 3 : Démarrage des Microservices (Ordre Recommandé)
Démarrez les services dans des terminaux distincts (ou via script d'automatisation) :

1. **Discovery Server (Eureka)** :
   ```bash
   java -jar backend/discovery-service/target/discovery-service-1.0.0-SNAPSHOT.jar
   ```
   *(Interface Eureka accessible sur : [http://localhost:8761](http://localhost:8761))*

2. **Config Server** :
   ```bash
   java -jar backend/config-service/target/config-service-1.0.0-SNAPSHOT.jar
   ```

3. **API Gateway** :
   ```bash
   java -jar backend/gateway-service/target/gateway-service-1.0.0-SNAPSHOT.jar
   ```

4. **Auth Service** :
   ```bash
   java -jar backend/auth-service/target/auth-service-1.0.0-SNAPSHOT.jar
   ```

5. **Project Service** :
   ```bash
   java -jar backend/project-service/target/project-service-1.0.0-SNAPSHOT.jar
   ```

6. **Team Matching Service** :
   ```bash
   java -jar backend/team-matching-service/target/team-matching-service-1.0.0-SNAPSHOT.jar
   ```

---

### Étape 4 : Lancement de l'Application Frontend React
Dans un nouveau terminal :
```bash
cd frontend
npm install
npm run dev
```
Accédez à l'application web sur **[http://localhost:5173](http://localhost:5173)**.

---

### 🔑 Comptes de Test Pré-configurés

Tous les comptes ci-dessous sont pré-insérés en base avec le mot de passe unique : **`Password123!`**

| Utilisateur | Email | Rôle | Spécialité / Rôle Métier |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@smartcollab.edu` | `ADMIN` | Administrateur global de la plateforme académique |
| **Dr. Mehdi Alami** | `prof.alami@smartcollab.edu` | `PROFESSOR` | Professeur en Génie Logiciel & Architectures Cloud |
| **Dr. Sara Bennani** | `prof.bennani@smartcollab.edu` | `PROFESSOR` | Professeure en Intelligence Artificielle & Big Data |
| **Yassine Benali** | `yassine.benali@smartcollab.edu` | `STUDENT` | Étudiant Leader : Backend Java / Spring Boot (5/5), Kafka, Postgres |
| **Fatima Zahra Mansouri**| `fatima.mansouri@smartcollab.edu`| `STUDENT` | Étudiante : DevOps, Docker & Kubernetes (5/5), Java |
| **Omar Tazi** | `omar.tazi@smartcollab.edu` | `STUDENT` | Étudiant : Data Science, Python & Machine Learning (5/5), Kafka |
| **Nour El Houda Idrissi**| `nour.houda@smartcollab.edu` | `STUDENT` | Étudiante : Frontend UI/UX, React.js (5/5), Tailwind |

---

> 💡 **Conseil pour l'équipe** : Consultez régulièrement la section [Guide du Développeur](#-10-guide-du-développeur--répartition-des-tâches-collaborateurs) pour synchroniser vos développements sur vos branches respectives (`frontend`, `backend`, `devops`).
