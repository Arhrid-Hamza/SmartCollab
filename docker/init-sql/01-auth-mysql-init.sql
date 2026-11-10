-- MySQL initialization script for emsicollab
CREATE DATABASE IF NOT EXISTS emsicollab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE emsicollab;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    sexe VARCHAR(20),
    campus VARCHAR(50),
    matricule VARCHAR(50) UNIQUE,
    filiere VARCHAR(100),
    niveau VARCHAR(50),
    groupe VARCHAR(50),
    matiere VARCHAR(150),
    avatar_url MEDIUMTEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_skills (
    user_id VARCHAR(36) NOT NULL,
    skill_id VARCHAR(36) NOT NULL,
    proficiency_level INT NOT NULL,
    years_of_experience DECIMAL(3,1) DEFAULT 0.0,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
