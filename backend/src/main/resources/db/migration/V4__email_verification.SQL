-- Add email verification fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified   BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);

-- Existing users (from seed data) are considered verified already
UPDATE users SET email_verified = TRUE WHERE email_verified IS NULL OR email_verified = FALSE;