# 🐳 EMSICollab — Infrastructure Docker (MySQL & phpMyAdmin)

Environnement conteneurisé dédié à l'authentification et à la persistance relationnelle avec MySQL 8 et son interface d'administration Web phpMyAdmin.

---

## 🏗️ Architecture des Conteneurs

| Service | Image | Ports hôte:conteneur | Rôle & Usage | Volume persistant |
| :--- | :--- | :--- | :--- | :--- |
| **`emsicollab-mysql`** | `mysql:8.0` | `3307:3306` | Base relationnelle `emsicollab` | `mysql-auth-data` |
| **`emsicollab-phpmyadmin`** | `phpmyadmin/phpmyadmin:latest` | `8085:80` | Interface Web phpMyAdmin | — |

---

## 🚀 Démarrage Rapide

```bash
# Démarrer les services MySQL et phpMyAdmin en arrière-plan
docker compose -f docker/docker-compose.yml up -d

# Vérifier l'état de santé
docker compose -f docker/docker-compose.yml ps
```

---

## 🌐 Accès aux Interfaces & Connexions

### 1. phpMyAdmin (Interface Web) :
- **URL** : [http://localhost:8085](http://localhost:8085)
- **Serveur** : `emsicollab-mysql` (ou `localhost:3307`)
- **Utilisateur** : `root`
- **Mot de passe** : `rootpassword`

### 2. Connexion directe MySQL :
- **Hôte** : `localhost`
- **Port** : `3307`
- **Base de données** : `emsicollab`
- **Utilisateur** : `root`
- **Mot de passe** : `rootpassword`

---

## 🧹 Maintenance & Réinitialisation

```bash
# Arrêter les conteneurs
docker compose -f docker/docker-compose.yml down

# Réinitialiser complètement les données (Reset usine)
docker compose -f docker/docker-compose.yml down -v
```
