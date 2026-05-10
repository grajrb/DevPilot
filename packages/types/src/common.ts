// Common types shared across all services

export type TenantPlan = 'free' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  allowUserRegistration: boolean;
  maxUsers: number;
  maxApiCallsPerMonth: number;
  maxServices: number;
  enableObservability: boolean;
  enableEvaluations: boolean;
  llmProviders: string[];
  defaultModel: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  tenantId: string;
  roles: Role[];
  permissions: Permission[];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  hashedKey: string;
  userId: string;
  tenantId: string;
  scopes: Permission[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export type Permission =
  // Services
  | 'services:read' | 'services:write' | 'services:delete'
  // Documentation
  | 'docs:read' | 'docs:write' | 'docs:delete'
  // Copilot
  | 'copilot:use' | 'copilot:configure' | 'copilot:manage_sessions'
  // Observability
  | 'observability:read' | 'observability:write'
  // Evaluations
  | 'evaluations:read' | 'evaluations:write' | 'evaluations:run'
  // API Keys
  | 'apiKeys:read' | 'apiKeys:write' | 'apiKeys:delete'
  // Audit
  | 'audit:read'
  // Settings
  | 'settings:read' | 'settings:write'
  // Team Management
  | 'users:read' | 'users:write' | 'users:delete'
  | 'roles:read' | 'roles:write' | 'roles:delete'
  // Tenant
  | 'tenant:manage';

export interface Role {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string; // userId
  email: string;
  tenantId: string;
  roles: string[];
  permissions: Permission[];
  iat?: number;
  exp?: number;
}
