-- Database Schema for SMI Backend
CREATE DATABASE IF NOT EXISTS smi_backend;
USE smi_backend;

-- Table: admins
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'superadmin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: peserta
CREATE TABLE IF NOT EXISTS peserta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    program VARCHAR(50) NOT NULL,
    catatan TEXT,
    status ENUM('pending', 'lunas', 'ditolak') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Admin Accounts
-- Superadmin accounts
INSERT INTO admins (username, password, role) VALUES 
('superadmin1', '$2y$12$WnAJ36cZd9MQsLn5BuzLiuO23tniIzGi/c7tLg43Ok30wvk1UER9q', 'superadmin'),
('superadmin2', '$2y$12$MeRNqW/0LTocKrHFY0.zqOkuys.dEgNFX0dsgzRLvOORJd6YxoHBC', 'superadmin'),
('superadmin3', '$2y$12$mMcydxH9oNRm2t0N31mjROepKwoJQRNv7ZaBYI9auKbMEXZnO8B9S', 'superadmin')
ON DUPLICATE KEY UPDATE username=username;

-- Admin account
INSERT INTO admins (username, password, role) VALUES 
('admin', '$2y$12$/.why9qbeeoUHtXp7E4pW.2C65JamykW/B1YpRwwd0I84gMQBVMhO', 'admin')
ON DUPLICATE KEY UPDATE username=username;
