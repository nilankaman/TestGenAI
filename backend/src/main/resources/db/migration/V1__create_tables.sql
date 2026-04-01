-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Generation requests table
CREATE TABLE generation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_description TEXT NOT NULL,
    framework VARCHAR(100),
    output_format VARCHAR(50) DEFAULT 'CODE',
    coverage_type VARCHAR(50) DEFAULT 'ALL',
    ui_language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(50) DEFAULT 'PROCESSING',
    tokens_used INT DEFAULT 0,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Test cases table
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500),
    type VARCHAR(50),
    description TEXT,
    code_snippet TEXT,
    method_name VARCHAR(255),
    generation_request_id UUID REFERENCES generation_requests(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_generation_requests_project_id ON generation_requests (project_id);
CREATE INDEX idx_generation_requests_created_at ON generation_requests (created_at DESC);
CREATE INDEX idx_test_cases_generation_request_id ON test_cases (generation_request_id);