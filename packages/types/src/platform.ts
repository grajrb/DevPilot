// Platform service types (NestJS backend)

import { Tenant, User, ApiKey, Permission, Role } from './common';

export type ServiceStatus = 'healthy' | 'degraded' | 'down';
export type ServiceProtocol = 'http' | 'grpc' | 'graphql';

export interface Service {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  status: ServiceStatus;
  protocol: ServiceProtocol;
  endpoints: ServiceEndpoint[];
  metadata: Record<string, any>;
  healthCheckUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceEndpoint {
  id: string;
  serviceId: string;
  path: string;
  method: string;
  timeout: number;
  retries: number;
}

export interface ServiceHealth {
  serviceId: string;
  status: ServiceStatus;
  latency: number;
  lastChecked: Date;
  error?: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

export interface AuditLogQuery {
  tenantId: string;
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit: number;
  offset: number;
}

export interface Documentation {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  version: string;
  isPublished: boolean;
  publishedAt?: Date;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeyCreateInput {
  name: string;
  scopes: Permission[];
  expiresInDays?: number;
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  keyPrefix: string;
  fullKey?: string; // Only returned once on creation
  scopes: Permission[];
  userId: string;
  tenantId: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

// Evaluation types
export type EvaluationStatus = 'pending' | 'running' | 'completed' | 'failed';
export type EvaluationType = 'correctness' | 'relevance' | 'faithfulness' | 'custom';

export interface Evaluation {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: EvaluationType;
  dataset: DatasetReference;
  metrics: EvaluationMetricConfig[];
  status: EvaluationStatus;
  config: EvaluationConfig;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface DatasetReference {
  id: string;
  name: string;
  type: 'csv' | 'jsonl' | 'api' | 'manual';
  rowCount: number;
}

export interface EvaluationMetricConfig {
  name: string;
  threshold: number;
  weight: number;
  parameters?: Record<string, any>;
}

export interface EvaluationConfig {
  batchSize: number;
  timeoutSeconds: number;
  concurrency: number;
}

export interface EvaluationRun {
  id: string;
  evaluationId: string;
  status: EvaluationStatus;
  results: EvaluationResult[];
  summary?: EvaluationSummary;
  error?: string;
  startedBy: string;
  startedAt: Date;
  finishedAt?: Date;
}

export interface EvaluationResult {
  exampleId: string;
  input: string;
  expected?: string;
  actual: string;
  metrics: {
    metricName: string;
    score: number;
    passed: boolean;
    details?: Record<string, any>;
  }[];
  overallScore: number;
  passed: boolean;
  latency: number;
  tokensUsed: number;
}

export interface EvaluationSummary {
  totalExamples: number;
  passed: number;
  failed: number;
  averageScore: number;
  totalLatency: number;
  totalCost: number;
}

// Observability types
export interface LLMCall {
  id: string;
  tenantId: string;
  userId?: string;
  sessionId?: string;
  apiKeyId?: string;
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  latency: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface MetricsQuery {
  tenantId: string;
  metricName?: string;
  startTime: Date;
  endTime: Date;
  interval?: '1m' | '5m' | '15m' | '1h' | '1d';
  groupBy?: string[];
  filters?: Record<string, string | number>;
}

export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
  labels?: Record<string, string>;
}

export interface Trace {
  traceId: string;
  tenantId: string;
  rootSpanName: string;
  spans: TraceSpan[];
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface TraceSpan {
  spanId: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  startTime: Date;
  endTime: Date;
  attributes: Record<string, any>;
  events: TraceEvent[];
  status: TraceStatus;
}

export interface TraceEvent {
  name: string;
  timestamp: Date;
  attributes: Record<string, any>;
}

export type TraceStatus = 'unset' | 'ok' | 'error';

// Settings
export interface TenantSettingsUpdate {
  allowUserRegistration?: boolean;
  maxUsers?: number;
  maxApiCallsPerMonth?: number;
  maxServices?: number;
  enableObservability?: boolean;
  enableEvaluations?: boolean;
  llmProviders?: string[];
  defaultModel?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}
