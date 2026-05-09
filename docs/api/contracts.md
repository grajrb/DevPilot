# DevPilot API Contracts

## Contract Principles

- All APIs are tenant-aware.
- All protected requests require authenticated user context.
- RBAC is enforced server-side, never only in the UI.
- Platform data and AI data are split across NestJS and FastAPI services.
- Responses should be optimized for the existing Stitch screens rather than generic CRUD shapes.

***

## Platform API (`apps/api`)

### Auth

#### `POST /auth/register`
Purpose:
- Create a user and associate them with a tenant or invite flow.

#### `POST /auth/login`
Purpose:
- Authenticate a user and return session/JWT details.

#### `GET /auth/me`
Purpose:
- Return current user, tenant, and role context for bootstrapping the app shell.

***

### Tenants and Users

#### `GET /tenants/current`
Purpose:
- Return active tenant metadata, plan, environment defaults, and feature flags.

#### `GET /users/me`
Purpose:
- Return current user profile and permissions.

***

### Services

#### `GET /tenants/:tenantId/services`
Purpose:
- Return service catalog list for the Services page.

Suggested query params:
- `search`
- `teamId`
- `environment`
- `runtime`
- `healthStatus`
- `page`
- `pageSize`

Response shape should support:
- table rows
- summary counts
- filter metadata

#### `POST /tenants/:tenantId/services`
Purpose:
- Register a new service.

#### `GET /tenants/:tenantId/services/:serviceId`
Purpose:
- Return service detail page data.

Should include:
- identity metadata
- owners
- repo links
- runtime info
- environments
- health summary
- recent deployments
- linked runbooks/docs references

#### `PATCH /tenants/:tenantId/services/:serviceId`
Purpose:
- Update editable service metadata.

***

### Deployments

#### `GET /tenants/:tenantId/deployments`
Purpose:
- Return deployment history for overview widgets and service detail tables.

#### `POST /tenants/:tenantId/services/:serviceId/deploy`
Purpose:
- Trigger a deploy action.

#### `POST /tenants/:tenantId/services/:serviceId/migrations`
Purpose:
- Trigger a migration or job action.

***

### API Keys

#### `GET /tenants/:tenantId/api-keys`
Purpose:
- List keys for the API Keys screen.

#### `POST /tenants/:tenantId/api-keys`
Purpose:
- Create a scoped API key.

#### `DELETE /tenants/:tenantId/api-keys/:keyId`
Purpose:
- Revoke a key.

***

### Audit Logs

#### `GET /tenants/:tenantId/audit-logs`
Purpose:
- Return filterable audit event rows.

Suggested query params:
- `actorId`
- `action`
- `entityType`
- `from`
- `to`
- `page`

***

### Settings

#### `GET /tenants/:tenantId/settings`
Purpose:
- Fetch tenant settings and integration config metadata.

#### `PATCH /tenants/:tenantId/settings`
Purpose:
- Update editable tenant settings.

***

## AI Service API (`apps/ai-service`)

### Documents

#### `POST /documents/upload`
Purpose:
- Upload a knowledge document for a tenant.

Form fields:
- `tenantId`
- `userId`
- `sourceType`
- `file`

Returns:
- document id
- upload status
- ingestion queued state

#### `GET /documents`
Purpose:
- List tenant documents for the Docs screen.

Suggested query params:
- `tenantId`
- `status`
- `sourceType`
- `search`

#### `GET /documents/:documentId/status`
Purpose:
- Return parsing / chunking / embedding progress.

***

### Ask Docs / RAG

#### `POST /rag/query`
Purpose:
- Answer a question using tenant-scoped document retrieval.

Request:
- `tenantId`
- `userId`
- `question`
- `topK`
- optional `serviceId`

Response:
- `answer`
- `sources[]`
- `latencyMs`
- `traceId`
- `feedbackAllowed`

Each source item should include:
- `documentId`
- `title`
- `chunkText`
- `score`
- optional anchors / path metadata

***

### Copilot

#### `POST /copilot/chat`
Purpose:
- Run a copilot interaction using docs, service metadata, and tool calls.

Request should support:
- `tenantId`
- `userId`
- `messages[]`
- `context` with `teamId`, `environment`, `serviceId`

Response should support the UI with:
- assistant message
- citations
- tool usage blocks
- referenced services / docs
- trace id

***

### Observability

#### `GET /observability/summary`
Purpose:
- Return KPI cards for token usage, cost, latency, and errors.

Suggested query params:
- `tenantId`
- `from`
- `to`
- `serviceId`
- `model`
- `environment`

#### `GET /observability/traces`
Purpose:
- Return trace list rows for the observability table.

#### `GET /observability/traces/:traceId`
Purpose:
- Return full trace detail for the trace detail screen.

Should include:
- request metadata
- prompt/input
- retrieval results
- tool calls
- model outputs
- eval summary
- cost and latency

***

### Evaluations

#### `GET /evaluations/summary`
Purpose:
- Return score summaries and trend data.

#### `GET /evaluations/runs`
Purpose:
- Return evaluation jobs or sample runs.

#### `POST /feedback`
Purpose:
- Submit thumbs up/down or structured user feedback for an answer.

***

## Shared Contract Types

These should exist in `packages/shared-types`:

- `AuthUser`
- `TenantContext`
- `Role`
- `ServiceSummary`
- `ServiceDetail`
- `DeploymentSummary`
- `DocumentSummary`
- `RagSource`
- `CopilotMessage`
- `CopilotResponse`
- `TraceSummary`
- `TraceDetail`
- `EvaluationSummary`
- `AuditLogRow`
- `ApiKeySummary`

## First API Milestone

Build these first:

Platform API:
- `POST /auth/login`
- `GET /auth/me`
- `GET /tenants/:tenantId/services`
- `POST /tenants/:tenantId/services`
- `GET /tenants/:tenantId/services/:serviceId`
- `POST /tenants/:tenantId/services/:serviceId/deploy`

AI API:
- `POST /documents/upload`
- `GET /documents`
- `POST /rag/query`

This set is enough to support:
- authenticated app shell
- services catalog
- service detail
- docs list
- basic Ask AI experience