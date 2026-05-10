-- DevPilot Initial Schema
-- Timestamp: 2025-01-01 00:00:01
-- Description: Core tables for multi-tenant architecture

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tenants table (organizations)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_plan CHECK (plan IN ('free', 'pro', 'enterprise'))
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    password_reset_token TEXT,
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(tenant_id, email)
);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(tenant_id, name)
);

-- Permissions table (static list of all possible permissions)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role permissions (many-to-many)
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User roles (many-to-many)
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Refresh tokens (for JWT refresh)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(50) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    scopes JSONB DEFAULT '[]', -- Array of permission codes
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Services (microservices registered in platform)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    protocol VARCHAR(50) DEFAULT 'http',
    health_check_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service endpoints
CREATE TABLE service_endpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    path VARCHAR(500) NOT NULL,
    method VARCHAR(20) NOT NULL,
    timeout_seconds INT DEFAULT 30,
    retries INT DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service health status
CREATE TABLE service_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'healthy',
    latency_ms INT,
    error_message TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN ('healthy', 'degraded', 'down'))
);

-- Audit logs (immutable)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    changes JSONB, -- { field: { old: val, new: val } }
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documentation
CREATE TABLE docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    version VARCHAR(50) DEFAULT '1.0',
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(tenant_id, slug, version)
);

-- Evaluation datasets
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'csv',
    storage_location TEXT, -- S3 path, DB reference, etc.
    row_count INT DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    dataset_id UUID NOT NULL REFERENCES datasets(id),
    metrics JSONB NOT NULL DEFAULT '[]', -- Array of metric configs
    config JSONB DEFAULT '{}', -- Batch size, timeout, concurrency
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_eval_status CHECK (status IN ('pending', 'running', 'completed', 'failed'))
);

-- Evaluation runs
CREATE TABLE evaluation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'running',
    started_by UUID NOT NULL REFERENCES users(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE,
    error TEXT,

    CONSTRAINT valid_run_status CHECK (status IN ('running', 'completed', 'failed'))
);

-- Evaluation results (individual example results)
CREATE TABLE evaluation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES evaluation_runs(id) ON DELETE CASCADE,
    example_id VARCHAR(255) NOT NULL,
    input_text TEXT NOT NULL,
    expected_text TEXT,
    actual_text TEXT NOT NULL,
    metrics JSONB NOT NULL DEFAULT '[]',
    overall_score DECIMAL(5,4) NOT NULL,
    passed BOOLEAN NOT NULL,
    latency_ms INT NOT NULL,
    tokens_used INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LLM calls (for observability)
CREATE TABLE llm_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) SET NULL,
    session_id UUID,
    api_key_id UUID REFERENCES api_keys(id) SET NULL,
    model VARCHAR(255) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    prompt_tokens INT NOT NULL,
    completion_tokens INT NOT NULL,
    total_tokens INT NOT NULL,
    cost DECIMAL(10,6) NOT NULL DEFAULT 0,
    latency_ms INT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error TEXT,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traces (OpenTelemetry-style)
CREATE TABLE traces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    trace_id VARCHAR(255) UNIQUE NOT NULL,
    root_span_name VARCHAR(500) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE trace_spans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trace_id UUID NOT NULL REFERENCES traces(id) ON DELETE CASCADE,
    span_id VARCHAR(255) UNIQUE NOT NULL,
    parent_span_id VARCHAR(255),
    name VARCHAR(500) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    attributes JSONB DEFAULT '{}',
    events JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'ok'
);

-- Chat sessions
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500),
    model VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    token_count INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector embeddings (for RAG)
CREATE TABLE vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL,
    embedding vector(1536), -- Adjust dimension based on model
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_services_tenant ON services(tenant_id);
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_llm_calls_tenant ON llm_calls(tenant_id);
CREATE INDEX idx_llm_calls_timestamp ON llm_calls(timestamp DESC);
CREATE INDEX idx_llm_calls_user ON llm_calls(user_id);
CREATE INDEX idx_evaluations_tenant ON evaluations(tenant_id);
CREATE INDEX idx_traces_tenant ON traces(tenant_id);
CREATE INDEX idx_chat_sessions_tenant_user ON chat_sessions(tenant_id, user_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_vectors_collection ON vectors(collection_id);
CREATE INDEX idx_vectors_tenant ON vectors(tenant_id);

-- Create HNSW index for vector similarity search
CREATE INDEX idx_vectors_embedding ON vectors
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Insert default permissions
INSERT INTO permissions (code, description, category) VALUES
-- Services
('services:read', 'Read service information', 'services'),
('services:write', 'Create and update services', 'services'),
('services:delete', 'Delete services', 'services'),
-- Documentation
('docs:read', 'Read documentation', 'docs'),
('docs:write', 'Create and edit documentation', 'docs'),
('docs:delete', 'Delete documentation', 'docs'),
-- Copilot
('copilot:use', 'Use AI copilot chat', 'copilot'),
('copilot:configure', 'Configure copilot settings', 'copilot'),
('copilot:manage_sessions', 'Manage chat sessions', 'copilot'),
-- Observability
('observability:read', 'View observability metrics and traces', 'observability'),
('observability:write', 'Configure observability', 'observability'),
-- Evaluations
('evaluations:read', 'View evaluations', 'evaluations'),
('evaluations:write', 'Create and edit evaluations', 'evaluations'),
('evaluations:run', 'Execute evaluation runs', 'evaluations'),
-- API Keys
('apiKeys:read', 'View API keys', 'api-keys'),
('apiKeys:write', 'Create and edit API keys', 'api-keys'),
('apiKeys:delete', 'Delete API keys', 'api-keys'),
-- Audit
('audit:read', 'View audit logs', 'audit'),
-- Settings
('settings:read', 'View tenant settings', 'settings'),
('settings:write', 'Modify tenant settings', 'settings'),
-- Team
('users:read', 'View users', 'team'),
('users:write', 'Create and edit users', 'team'),
('users:delete', 'Delete users', 'team'),
('roles:read', 'View roles', 'team'),
('roles:write', 'Create and edit roles', 'team'),
('roles:delete', 'Delete roles', 'team'),
-- Tenant
('tenant:manage', 'Manage tenant settings and billing', 'tenant');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_docs_updated_at BEFORE UPDATE ON docs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row-level security policies (RLS) for multi-tenancy
-- Enable RLS on all tenant-scoped tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE trace_spans ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vectors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (application will set tenant_id via connection variable)
-- These are placeholder policies; actual enforcement happens at app layer
-- but we add defense-in-depth with RLS

CREATE POLICY tenant_isolation_users ON users
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_roles ON roles
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_api_keys ON api_keys
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_services ON services
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_audit ON audit_logs
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

CREATE POLICY tenant_isolation_llm_calls ON llm_calls
    USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- Comment on tables for documentation
COMMENT ON TABLE tenants IS 'Organizations using DevPilot platform';
COMMENT ON TABLE users IS 'Platform users belonging to a tenant';
COMMENT ON TABLE api_keys IS 'API keys for programmatic access to LLM endpoints';
COMMENT ON TABLE llm_calls IS 'Immutable log of all LLM API calls for cost and usage tracking';
COMMENT ON TABLE evaluations IS 'Evaluation configurations for testing LLM responses';
COMMENT ON TABLE chat_sessions IS 'User chat sessions with the copilot';
