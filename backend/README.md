# ⚙️ EmsiCollab — Pôle Back-End (Architecture Microservices Spring Boot)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20Alpine-336791.svg)](https://www.postgresql.org/)
[![Spring Security](https://img.shields.io/badge/Spring%20Security-6.3-red.svg)](https://spring.io/projects/spring-security)
[![JWT](https://img.shields.io/badge/JWT-jjwt%200.12.6-purple.svg)](https://jwt.io/)

Bienvenue sur la branche **`backend`** d'**EmsiCollab** ! Cette branche regroupe les microservices métier développés en **Java 21 LTS** avec **Spring Boot 3.3.4**, persistance relationnelle PostgreSQL et sécurisation par tokens JWT sans état (Stateless).

---

## 🏛️ 1. Architecture & Responsabilités des Microservices

```text
backend/
├── pom.xml                     # POM parent multi-modules (Spring Boot 3.3.4, Java 21)
└── auth-service/               # Service central d'authentification, profils EMSI, sujets & candidatures
    ├── pom.xml
    └── src/main/java/com/smartcollab/auth/
        ├── config/             # Spring Security, SecurityFilterChain, PasswordEncoder, JWT Auth Filter
        ├── controller/         # Contrôleurs REST (/api/v1/auth, /api/v1/subjects, /api/v1/groups, /api/v1/applications)
        ├── dto/                # Request & Response DTOs
        ├── entity/             # Entités JPA (User, Role, Skill, ProjectSubject, StudentGroup, SubjectApplication)
        ├── repository/         # Repositories Spring Data JPA
        ├── security/           # JwtTokenProvider, CustomUserDetailsService
        ├── service/            # AuthService, SubjectService, GroupService, ApplicationService
        └── util/               # DataInitializer (Seeding des comptes officiels EMSI)
```

---

## 🔒 2. Authentification Institutionnelle EMSI (`@emsi-edu.ma`)

Le backend applique une politique stricte de validation du domaine institutionnel :
- **Règle de validation** : Tout utilisateur qui s'enregistre ou s'authentifie sur la plateforme doit obligatoirement posséder une adresse email se terminant par `@emsi-edu.ma`.
- **Implémentation** dans `AuthService.java` :
  ```java
  if (request.getEmail() == null || !request.getEmail().trim().toLowerCase().endsWith("@emsi-edu.ma")) {
      throw new IllegalArgumentException("L'adresse email doit obligatoirement appartenir au domaine institutionnel @emsi-edu.ma");
  }
  ```
- **Hachage des mots de passe** : `BCryptPasswordEncoder(12)`.
- **Signature JWT** : Algorithme HMAC-SHA512 avec expiration configurable (24 heures).

---

## 🗄️ 3. Entités & Modèle de Données JPA

### 1. `User` (`users`)
- Champs d'identité : `id` (UUID), `email` (Unique, `@emsi-edu.ma`), `password` (BCrypt), `firstName`, `lastName`, `role` (`STUDENT`, `PROFESSOR`, `ADMIN`).
- Champs académiques EMSI :
  - `matricule` : ex. `C-2025-000564` (Étudiant) ou `ENS-2026-042` (Enseignant)
  - `filiere` : ex. *Ingénierie Informatique et Réseaux (IIR)*, *IFA*, *Génie Civil*
  - `niveau` : ex. *5ème année*, *4ème année*
  - `classeGroup` : ex. *5DSIO G2 - G22*
  - `campus` : ex. *CASA ORANGERS*, *Rabat*, *Marrakech*
  - `academicYear` : ex. *2026-2027*

### 2. `ProjectSubject` (`pfe_subjects`)
- `id`, `title`, `description`, `type` (`PFE`, `PFA`), `technologies`, `objectives`, `filiereTarget`, `niveauTarget`, `maxStudentsPerGroup`, `deadlineDate`, `status` (`PROPOSE`, `VALIDE`, `ATTRIBUE`, `ARCHIVE`), `professorId`, `professorName`.

### 3. `StudentGroup` (`student_groups`)
- `id`, `name`, `leaderId`, `leaderName`, `filiere`, `academicYear`, `status` (`OUVERT`, `VALIDE`, `AFFECTE`).

### 4. `SubjectApplication` (`subject_applications`)
- `id`, `subjectId`, `subjectTitle`, `studentId`, `studentName`, `groupId`, `groupName`, `priorityOrder` (1, 2, 3), `motivation`, `status` (`EN_ATTENTE`, `ACCEPTE`, `REFUSE`), `feedback`.

---

## 🌐 4. Contrats d'APIs REST (`/api/v1`)

| Méthode | Endpoint | Accès | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authentification et émission du token Bearer JWT |
| `POST` | `/api/v1/auth/register` | Public | Inscription avec validation obligatoire `@emsi-edu.ma` |
| `GET` | `/api/v1/auth/me` | Authentifié | Profil de l'utilisateur actuellement connecté |
| `GET` | `/api/v1/subjects` | Authentifié | Catalogue des sujets PFE/PFA avec filtres filière et type |
| `POST` | `/api/v1/subjects` | Prof / Admin | Publication d'un nouveau sujet PFE/PFA |
| `GET` | `/api/v1/groups` | Authentifié | Consultation des groupes et binômes constitués |
| `POST` | `/api/v1/groups` | Étudiant | Création d'un groupe ou invitation d'un binôme |
| `GET` | `/api/v1/applications` | Authentifié | Liste des candidatures (reçues pour prof, soumises pour étudiant) |
| `POST` | `/api/v1/applications` | Étudiant | Soumission d'un vœu de sujet PFE avec ordre de priorité |
| `PUT` | `/api/v1/applications/{id}/status` | Prof / Admin | Validation (`ACCEPTE`) ou refus (`REFUSE`) d'une candidature |

---

## 👥 5. Comptes de Démonstration EMSI (`DataInitializer`)

Au démarrage du service, `DataInitializer.java` initialise automatiquement les comptes officiels suivants :

| Rôle | Nom & Prénom | Email Institutionnel | Mot de passe | Détails Académiques |
| :--- | :--- | :--- | :--- | :--- |
| **Étudiant** | Hamza ARHRID | `hamza.arhrid@emsi-edu.ma` | `Student123!` | 5DSIO G2 - G22 • Matricule: C-2025-000564 • Casa Orangers |
| **Professeur** | Karim BENALI | `karim.benali@emsi-edu.ma` | `Prof123!` | Chef Dép. Génie Logiciel • Matricule: ENS-2026-042 |
| **Direction** | Direction Pédagogique | `admin@emsi-edu.ma` | `Admin123!` | Coordination Centrale PFE • Matricule: ADM-2026-001 |

---

## 🚀 6. Compilation & Démarrage

```bash
# Compilation du backend complet
mvn -f backend/pom.xml clean compile

# Démarrage de auth-service
cd backend/auth-service
mvn spring-boot:run
# Le service écoute sur http://localhost:8081 (Base API: http://localhost:8081/api/v1)
```
