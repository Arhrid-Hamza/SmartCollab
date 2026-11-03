# 🌟 À Propos de SmartCollab (About)

> **Plateforme Cloud-Native Intelligente de Gestion de Projets Académiques, Sujets PFE et de Matching / Recommandation de Compétences Étudiantes**

---

## 🎯 1. Vision & Mission du Projet

Dans les écoles d'ingénieurs et universités techniques, la réussite d'un projet informatique complexe (Projets de Fin d'Études - PFE, Projets d'Intégration, Microservices, Intelligence Artificielle, Full-Stack, IoT, Cloud) repose sur deux piliers majeurs :
1. **L'adéquation profil-sujet** : Trouver le sujet PFE idéal correspondant aux aptitudes et ambitions technologiques de l'étudiant.
2. **La complémentarité des compétences** au sein des équipes d'étudiants lorsqu'il s'agit de projets collaboratifs ou en binôme.

Traditionnellement, le choix des sujets PFE et la formation des équipes se font de manière manuelle, arbitraire ou par affinité personnelle, aboutissant souvent à des inadéquations techniques (ex: un étudiant affecté à un sujet exigeant des technologies qu'il ne maîtrise pas, ou des équipes déséquilibrées sans compétences UI ou DevOps).

**SmartCollab** répond à ce défi en introduisant un double moteur algorithmique d'adéquation de compétences (*Skills Compatibility & Recommendation Engine*) :
- **Recommandation individualisée de sujets PFE** pour orienter chaque étudiant vers les sujets les plus pertinents par rapport à son profil technique.
- **Constitution et évaluation stratégique d'équipes** pour garantir la viabilité technique des projets académiques de groupe.

---

## 💡 2. Proposition de Valeur & Fonctionnalités Clés

### 🎓 Pour les Étudiants
- **Valorisation du Profil Technique** : Déclaration fine de compétences standardisées par niveau (1 à 5) et visualisation sous forme de diagramme Radar d'expertise.
- **Recommandation Intelligente de Sujets PFE** : Flux personnalisé de sujets PFE proposés par les enseignants, classés par score d'adéquation décroissant (ex: *95% Match*), avec mise en exergue des technologies acquises et des prérequis manquants.
- **Constitution Stratégique d'Équipes** : Recherche de coéquipiers et analyse en direct des forces et faiblesses du groupe.
- **Matching Studio Prédictif** : Simulation de compatibilité avec les sujets proposés par les professeurs, calcul d'un score d'adéquation pondéré (0 à 100%) et recommandations ciblées de profils à recruter pour combler les lacunes bloquantes (veto).

### 👨‍🏫 Pour les Professeurs
- **Atelier de Conception de Sujets PFE & Projets** : Publication de sujets PFE ou projets académiques avec description détaillée, livrables attendus, contraintes de taille d'équipe (individuel `min=1, max=1` ou binôme/groupe `min=2, max=4`), échéances et exigences techniques pondérées ($w_i$).
- **Critères Obligatoires (Veto)** : Possibilité de rendre certaines compétences indispensables pour empêcher les candidatures inadéquates.
- **Revue Objective des Candidatures** : Classement automatisé des étudiants et équipes postulants par score de compatibilité décroissant et validation en un clic.

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
