-- =========================
-- DATABASE SETUP
-- =========================
CREATE DATABASE IF NOT EXISTS Portofolio_Glory;
USE Portofolio_Glory;

-- =========================
-- 1. TABLE USERS (ADMIN LOGIN)
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);

-- =========================
-- 2. TABLE PROFILES
-- =========================
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100),
    prodi VARCHAR(100),
    universitas VARCHAR(100),
    fakultas VARCHAR(100),
    semester INT,
    alamat TEXT,
    email VARCHAR(100),
    foto_url TEXT
);

-- =========================
-- 3. TABLE SKILLS
-- =========================
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_skill VARCHAR(100),
    icon_class VARCHAR(50)
);

-- =========================
-- 4. TABLE EXPERIENCES
-- =========================
CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    posisi VARCHAR(100),
    perusahaan VARCHAR(100),
    durasi VARCHAR(50),
    deskripsi TEXT
);

-- =========================
-- 5. TABLE PROJECTS
-- =========================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(100),
    deskripsi TEXT,
    gambar_url TEXT,
    link_project VARCHAR(255)
);

-- =========================
-- 6. TABLE CONTACT_MESSAGES
-- =========================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100),
    email VARCHAR(100),
    pesan TEXT,
    tanggal_kirim TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
