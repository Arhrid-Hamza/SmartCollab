# 💻 EmsiCollab — Pôle Front-End (React 18 SPA & Tailwind CSS)

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-orange.svg)](https://lucide.dev/)
[![EMSI Green](https://img.shields.io/badge/Brand%20Color-%23006837-green.svg)](https://emsi.ma/)

Bienvenue sur la branche **`frontend`** d'**EmsiCollab** ! Cette branche est exclusivement dédiée à l'application cliente Web (Single Page Application) développée avec **React 18**, **Vite** et **Tailwind CSS**. Elle implémente l'identité officielle de l'**École Marocaine des Sciences de l'Ingénieur (EMSI)** et offre des espaces de travail strictement séparés et adaptés à chaque profil utilisateur (**Étudiants**, **Professeurs Encadrants**, **Direction Pédagogique & Administration**).

---

## 🏛️ 1. Architecture & Organisation des Composants

```text
frontend/
├── public/                     # Assets statiques publics
│   ├── emsi-logo.png           # Logo officiel EMSI (Membre d'Honoris United Universities)
│   └── hamza-avatar.png        # Photo de profil étudiant (Hamza Arhrid)
├── src/
│   ├── api/
│   │   └── client.js           # Client Axios avec intercepteur JWT & Base URL (/api/v1)
│   ├── assets/                 # Images et logos bundlés
│   ├── components/             # Composants réutilisables
│   │   ├── EmsiLogo.jsx        # Composant logo vectoriel / image institutionnelle
│   │   ├── HeaderBar.jsx       # Barre supérieure EMSI (vert #006837, cloche, profil cliquable)
│   │   ├── Sidebar.jsx         # Barre latérale dynamique avec menus séparés par rôle
│   │   └── ProtectedRoute.jsx  # Garde de route par authentification JWT
│   ├── context/
│   │   └── AuthContext.jsx     # Contexte React global d'authentification (login, register, logout)
│   ├── pages/                  # Écrans et Tableaux de Bord par Rôle
│   │   ├── LoginPage.jsx               # Login institutionnel (@emsi-edu.ma) & boutons démo
│   │   ├── DashboardPage.jsx           # Routeur principal des vues selon le rôle
│   │   ├── AccueilView.jsx             # Clone exact du portail étudiant EMSI (Bonjour Hamza, 5DSIO)
│   │   ├── ScheduleView.jsx            # Emploi du temps complet (Semaine S1, Lundi à Samedi)
│   │   ├── AbsencesView.jsx            # Clone du portail d'absences EMSI (14 absences & filtres)
│   │   ├── AnnouncementsView.jsx       # Dernières annonces pédagogiques et plannings d'examens
│   │   ├── ProfileView.jsx             # Dossier étudiant / enseignant / direction imprimable
│   │   ├── SubjectsView.jsx            # Catalogue des sujets PFE/PFA & formulaire de dépôt prof
│   │   ├── GroupsView.jsx              # Constitution et gestion des équipes et binômes
│   │   ├── ApplicationsView.jsx        # Suivi des candidatures et validation professeur
│   │   ├── ProfessorDashboardView.jsx  # Tableau de bord dédié aux professeurs
│   │   ├── ProfessorMentoringView.jsx  # Suivi de l'encadrement, livrables PFE & soutenances
│   │   ├── ProfessorGradesView.jsx     # Pointage des présences et saisie des notes CC
│   │   ├── AdminDashboardView.jsx      # Tableau de bord Direction des Études (KPIs filières)
│   │   ├── AdminUsersView.jsx          # Annuaire et gestion des comptes utilisateurs
│   │   ├── AdminReportsView.jsx        # Procès-verbaux de délibérations et bilans PFE
│   │   └── StaticViews.jsx             # Mesures disciplinaires & questionnaires de fin d'année
│   ├── App.jsx                 # Configuration des routes
│   ├── index.css               # Directives Tailwind et styles globaux
│   ├── tailwind-compiled.css   # Bundle CSS statique précompilé (garantie de style permanent)
│   └── main.jsx                # Point d'entrée de l'application
├── package.json                # Dépendances et scripts (build:css, dev, build)
├── tailwind.config.js          # Palette officielle EMSI (emsi-50 à emsi-950)
└── vite.config.js              # Configuration Vite avec PostCSS plugins
```

---

## 🎨 2. Spécification Détaillée des 3 Dashboards par Rôle

### 👨‍🎓 A. Dashboard Étudiant (`STUDENT`)
- **Accueil** : Clone fidèle de la maquette du portail étudiant EMSI :
  - En-tête : *Bonjour Hamza ! • Année 2026-2027 • Casablanca • Ingénierie Informatique et Réseaux • 5ème année • 5DSIO G2 - G22*.
  - Slogan officiel : *« Chaque apprentissage est une étape vers ton avenir. »*
  - Widget *Prochain cours* : DevOps (Vendredi 08:30 - 10:30, Salle SC34).
  - Widget *Aujourd'hui* : 3 cours (Projet, ERP, Gouvernance des SI).
  - Widget *Ma situation* : 14 Absences justifiées ou non, 1 Nouvelle annonce, 0 Rappel.
  - Widget *Mon profil* : Bouton « Voir mon profil » cliquable ouvrant instantanément la fiche complète.
- **Mon emploi du temps** : Planning hebdomadaire complet (du Lundi au Samedi) pour le semestre S1, avec boutons de sélection des jours, statut « Aujourd'hui » et bascule Jour / Semaine / Mois / Liste.
- **Mes absences** : Interface conforme au portail des absences EMSI avec filtres par semestre et cours, récapitulatif (14 non justifiées), tableau d'historique et panneau latéral de détail.
- **Sujets PFE & Choix** : Consultation des sujets validés, filtres par filière (IIR, IFA, GC, GE) et soumission de candidatures avec ordre de priorité (Choix 1, 2, 3) et motivation.
- **Mes Groupes** : Création d'un binôme/trinôme et invitation d'étudiants par matricule.

---

### 👨‍🏫 B. Dashboard Professeur (`PROFESSOR`)
- **Tableau de Bord Enseignant** :
  - KPIs en temps réel : Sujets déposés, candidatures à valider, groupes affectés, prochain créneau d'encadrement.
  - Traitement rapide des candidatures en attente avec boutons directs *Valider & Affecter* ou *Refuser*.
- **Gestion des Sujets PFE/PFA** : Modal de publication d'un nouveau sujet avec titre, objectifs, technologies, filière cible et taille maximale du groupe.
- **Suivi de l'Encadrement PFE (`ProfessorMentoringView`)** :
  - Suivi des groupes encadrés avec jauge de progression en pourcentage.
  - Validation des livrables : *Cahier des charges*, *Sprint 1*, *Sprint 2*, *Rapport mi-parcours*, *Mémoire final*.
  - Planification des points d'étape et date de soutenance prévisionnelle avec composition du jury.
- **Saisie des Absences & Notes (`ProfessorGradesView`)** :
  - Sélection de la classe (5DSIO G2, 5DSIO G1, 4IIR) et du module.
  - Boutons interactifs Présent/Absent pour chaque étudiant.
  - Saisie des notes de contrôle continu (CC1, CC2, Projet) avec calcul dynamique de la moyenne.

---

### 🏛️ C. Dashboard Direction Pédagogique & Administration (`ADMIN`)
- **Tableau de Bord Global** :
  - Supervision multi-campus (Casablanca Orangers, Roudani, Maarif).
  - Taux d'affectation PFE en direct par filière : *IIR (92%)*, *IFA (75%)*, *Génie Civil (68%)*, *Génie Électrique (80%)*.
- **Validation des Sujets** : Commission pédagogique pour approuver, demander correction ou rejeter les sujets soumis par les professeurs.
- **Gestion des Comptes & Annuaire (`AdminUsersView`)** :
  - Recherche universelle par nom, matricule ou email.
  - Filtre par statut et par rôle.
  - Boutons d'action pour activer ou suspendre les accès d'un utilisateur.
- **Bilans & Délibérations (`AdminReportsView`)** :
  - Téléchargement et impression des PVs officiels, matrices d'affectation et listes d'émargement.

---

## 💎 3. Garantie de Style CSS & Thème EMSI

Pour éliminer définitivement tout risque de styles manquants ou de flash CSS non compilé :
1. **Compilation PostCSS directe** : `vite.config.js` configure explicitement `tailwindcss()` et `autoprefixer()`.
2. **Bundle CSS statique de sécurité** : Le script `build:css` génère automatiquement `src/tailwind-compiled.css` qui est importé dans `main.jsx`.
3. **Palette officielle EMSI** :
   ```javascript
   emsi: {
     700: '#006837', // Vert Officiel EMSI
     800: '#00532c',
     900: '#003d20',
   }
   ```

---

## 🔐 4. Authentification Institutionnelle

- **Validation `@emsi-edu.ma`** : Le formulaire de connexion et d'inscription rejette tout email non conforme au domaine éducatif officiel de l'EMSI.
- **Comptes démo pré-remplis** : Les cartes démo remplissent les champs sans soumission automatique, invitant l'utilisateur à cliquer explicitement sur **« Se connecter »** pour valider la démarche d'authentification.
  - Étudiant : `hamza.arhrid@emsi-edu.ma`
  - Professeur : `karim.benali@emsi-edu.ma`
  - Administration : `admin@emsi-edu.ma`

---

## 🚀 5. Scripts & Commandes de Développement

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement (avec génération du CSS statique)
npm run dev

# Compilation de production (build CSS + bundle Vite optimisé dans dist/)
npm run build

# Prévisualisation du build de production
npm run preview
```
