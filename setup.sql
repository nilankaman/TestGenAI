-- Run this once before starting the backend for the first time.
-- Open a terminal and run: psql -U postgres -f setup.sql

CREATE DATABASE testgen_db;
CREATE USER testgen_user WITH ENCRYPTED PASSWORD 'testgen_pass';
GRANT ALL PRIVILEGES ON DATABASE testgen_db TO testgen_user;

-- Flyway will create all tables automatically on first backend startup.
-- You do NOT need to create any tables manually.
