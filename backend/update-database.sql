-- Update existing database to add role column and insert new accounts
USE smi_backend;

-- Add role column if it doesn't exist
ALTER TABLE admins ADD COLUMN IF NOT EXISTS role ENUM('admin', 'superadmin') DEFAULT 'admin';

-- Update existing admin to have admin role
UPDATE admins SET role = 'admin' WHERE username = 'admin' AND role IS NULL;

-- Insert superadmin accounts
INSERT IGNORE INTO admins (username, password, role) VALUES 
('superadmin1', '$2y$12$WnAJ36cZd9MQsLn5BuzLiuO23tniIzGi/c7tLg43Ok30wvk1UER9q', 'superadmin'),
('superadmin2', '$2y$12$MeRNqW/0LTocKrHFY0.zqOkuys.dEgNFX0dsgzRLvOORJd6YxoHBC', 'superadmin'),
('superadmin3', '$2y$12$mMcydxH9oNRm2t0N31mjROepKwoJQRNv7ZaBYI9auKbMEXZnO8B9S', 'superadmin');

-- Update admin password
UPDATE admins SET password = '$2y$12$/.why9qbeeoUHtXp7E4pW.2C65JamykW/B1YpRwwd0I84gMQBVMhO' WHERE username = 'admin';

-- Show current admin accounts
SELECT id, username, role, created_at FROM admins ORDER BY id;
