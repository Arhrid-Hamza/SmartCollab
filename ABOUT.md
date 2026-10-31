# 🌟 À Propos de SmartCollab (About)

> **Plateforme Cloud-Native Intelligente de Gestion de Projets Académiques et de Matching de Compétences Étudiantes**

---

## 🎯 1. Vision & Mission du Projet

Dans les écoles d'ingénieurs et universités techniques, la réussite d'un projet informatique complexe (Microservices, Intelligence Artificielle, Full-Stack, IoT, Cloud) repose avant tout sur la **complémentarité des compétences** au sein de l'équipe étudiante.

Traditionnellement, les équipes se forment par affinité personnelle ou géographique, aboutissant souvent à des équipes déséquilibrées (ex: 4 profils backend sans aucune compétence frontend ou DevOps). Ce manque d'équilibre entraîne des surcharges individuelles, des retards de livraison et des projets inachevés.

**SmartCollab** répond à ce défi en introduisant un moteur algorithmique d'adéquation de compétences (*Skills Compatibility Engine*). La plateforme permet aux étudiants de constituer des équipes équilibrées et aide les enseignants à évaluer objectivement l'adéquation technique des groupes candidats à leurs projets.

---

## 💡 2. Proposition de Valeur & Fonctionnalités Clés

### 🎓 Pour les Étudiants
- **Valorisation du Profil Technique** : Déclaration fine de compétences standardisées par niveau (1 à 5) et visualisation sous forme de diagramme Radar d'expertise.
- **Constitution Stratégique d'Équipes** : Recherche de coéquipiers et analyse en direct des forces et faiblesses du groupe.
- **Matching Studio Prédictif** : Simulation de compatibilité avec les sujets proposés par les professeurs, calcul d'un score d'adéquation pondéré (0 à 100%) et recommandations ciblées de profils à recruter pour combler les lacunes bloquantes (veto).

### 👨‍🏫 Pour les Professeurs
- **Atelier de Conception de Sujets** : Publication de projets académiques avec contraintes de taille d'équipe (min/max), échéances et exigences techniques pondérées ($w_i$).
- **Critères Obligatoires (Veto)** : Possibilité de rendre certaines compétences indispensables pour empêcher les candidatures inadéquates.
- **Revue Objective des Candidatures** : Classement automatisé des équipes postulantes par score de compatibilité décroissant et validation en un clic.

### 🛡️ Pour les Administrateurs
- **Gouvernance Globale** : Gestion des utilisateurs (étudiants, enseignants), attribution des rôles et contrôle d'accès (RBAC).
- **Taxonomie des Compétences** : Référentiel centralisé des technologies et frameworks organisés par domaines (Backend, Frontend, DevOps, IA/Data, Mobile).
- **Supervision Système** : Monitoring de la santé des microservices et des métriques de la plateforme.

---

## 🏛️ 3. Architecture Technique & Choix Technologiques

SmartCollab est conçu selon les meilleures pratiques industrielles des systèmes distribués cloud-native :

- **Pattern Database-per-Service** : Isolation stricte de la persistance entre services métier (3 bases de données PostgreSQL indépendantes : `auth_db`, `project_db`, `team_matching_db`).
- **Domain-Driven Design (DDD)** : Découpage modulaire orienté métier avec des contextes délimités (*Bounded Contexts*).
- **API Gateway Réactive** : Point d'accès unique avec filtre réactif `JwtAuthenticationFilter`, validation des tokens JWT et propagation des en-têtes d'identité (`X-User-Id`, `X-User-Role`, `X-User-Email`).
- **Service Registry Dynamique** : Résolution transparente des instances de microservices via Spring Cloud Eureka Discovery.
- **Architecture Événementielle (EDA)** : Découplage asynchrone des flux critiques via Apache Kafka en mode KRaft (sans ZooKeeper).
- **Frontend SPA Réactif** : Interface monopage moderne développée avec React 18, Vite, Tailwind CSS et Lucide Icons.

---

## 📊 4. Fiche d'Identité Technique

| Dimension | Technologies & Standards |
| :--- | :--- |
| **Backend Core** | Java 21 LTS, Spring Boot 3.3.4, Spring Cloud 2023.0.3, Spring Data JPA |
| **Sécurité & Auth** | Spring Security, BCrypt, JWT (JSON Web Tokens) stateless |
| **Communication Inter-services**| Synchrone : OpenFeign REST Client \| Asynchrone : Apache Kafka (KRaft mode :9092) |
| **Persistance des Données** | PostgreSQL 16 (3 instances conteneurisées distinctes) |
| **Frontend & UI** | React 18, Vite, Tailwind CSS 3.4, React Router 6, Lucide Icons |
| **Orchestration & DevOps** | Docker, Docker Compose, Maven multi-modules |

---

## 🌿 5. Organisation du Repository GitHub

Le projet adopte une organisation claire articulée autour de **4 branches principales** :

```text
SmartCollab (Monorepo)
├── 🛡️ main     -> Version de référence stable, documentation et releases
├── 💻 frontend -> Interface utilisateur React 18, Tailwind CSS et Dashboards
├── ⚙️ backend  -> Microservices Spring Boot (auth, project, team-matching, gateway, discovery, config)
└── 🐳 devops   -> Infrastructure Docker Compose, PostgreSQL multi-DBs et Apache Kafka
```

---

## 👥 6. Équipe & Contexte Académique

- **Projet** : Plateforme SmartCollab — Gestion Intelligente de Projets & Équipes
- **Cadre** : Cursus d'Ingénierie & Informatique
- **Année Académique** : 2026-2027
- **Auteur & Lead** : [Hamza Arhrid](https://github.com/Arhrid-Hamza)
- **Dépôt Officiel** : [https://github.com/Arhrid-Hamza/SmartCollab](https://github.com/Arhrid-Hamza/SmartCollab)

---

## 📄 7. Licence

Ce projet est distribué sous licence pédagogique et académique. Tous droits réservés © 2026 SmartCollab Team.
