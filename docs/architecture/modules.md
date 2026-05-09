# DevPilot Module Architecture

## System Split

DevPilot should be built as three distinct systems inside one monorepo:

1. `apps/web` - Next.js frontend
2. `apps/api` - NestJS platform backend
3. `apps/ai-service` - FastAPI AI backend

Shared packages:
- `packages/shared-types`
- `packages/ui`
- `packages/config`

This separation keeps platform workflows, AI workflows, and UI concerns independently deployable and easier to reason about.

***

## Frontend Modules (`apps/web`)

### Layout
- App shell layout
- Sidebar navigation
- Top header
- Search / command bar
- Tenant switcher
- Notification center
- User menu

### Feature Areas
- Overview dashboard module
- Services module
- Service detail module
- Docs module
- Ask AI chat module
- Copilot module
- Observability module
- Trace detail module
- Evaluations module
- API keys module
- Audit logs module
- Settings module

### Shared UI Primitives
- Button
- Badge
- Card
- Stat tile
- Table
- Tabs
- Drawer / side panel
- Modal
- Empty state
- Skeleton
- Code block
- Timeline / trace step item
- Search input
- Filter bar

### Shared Frontend Services
- Auth client
- API client
- Query cache / data fetching layer
- Role guard helpers
- Feature flag helpers
- Theme + design token layer

***

## Platform Backend Modules (`apps/api`)

### Core Identity and Access
- `auth`
- `users`
- `tenants`
- `teams`
- `rbac`
- `sessions`

### Developer Platform Core
- `services`
- `deployments`
- `environments`
- `service-links`
- `support-status` (optional later)

### Admin and Governance
- `api-keys`
- `audit-logs`
- `settings`
- `notifications` (optional later)

### Cross-Cutting
- `health`
- `config`
- `database`
- `logging`
- `rate-limit`
- `events`

### Responsibilities

The platform backend owns:
- Auth and JWT/session issuance
- Tenant resolution
- RBAC checks
- Service catalog CRUD
- Deployment action orchestration
- API key lifecycle
- Audit event emission
- User and tenant settings

It should not own:
- Embeddings
- Chunking
- RAG retrieval orchestration
- LLM inference logic
- Evaluation pipelines

***

## AI Backend Modules (`apps/ai-service`)

### Document and Retrieval Layer
- `documents`
- `ingestion`
- `chunking`
- `embeddings`
- `retrieval`
- `vector-store`

### Copilot and LLM Layer
- `rag`
- `copilot`
- `tooling`
- `prompts`
- `models`

### Observability and Quality
- `llm-logs`
- `traces`
- `evaluations`
- `feedback`
- `cost-latency`

### Cross-Cutting
- `tenant-context`
- `auth-verification`
- `storage`
- `queue` / background jobs
- `health`
- `config`

### Responsibilities

The AI backend owns:
- Document upload intake processing
- Parsing and chunking
- Embedding generation
- Retrieval and RAG answering
- Copilot orchestration
- Tool-call execution wrappers
- LLM trace capture
- Eval result capture
- Answer/source packaging for the UI

It should not own:
- Core user authentication UX
- Tenant admin settings
- Service catalog persistence as the source of truth

***

## Shared Data Domains

### Identity
- Tenant
- User
- Team
- Membership
- Role

### Platform
- Service
- Deployment
- Environment
- ServiceLink
- RunbookReference

### Knowledge / AI
- Document
- DocumentChunk
- RetrievalResult
- ChatMessage
- CopilotSession
- ToolCall
- LlmCall
- LlmTrace
- EvaluationResult
- Feedback

### Governance
- ApiKey
- AuditLog
- Setting

***

## Integration Boundaries

### Web -> Platform API
Used for:
- Login / auth
- Tenant and user context
- Services data
- Deployments data
- API keys
- Audit logs
- Settings

### Web -> AI Service
Used for:
- Document upload status and doc queries
- Ask AI chat
- Copilot interactions
- Observability trace views
- Evaluations views

### Platform API -> AI Service
Optional internal integrations:
- Service metadata lookup for copilot context
- Tenant and role verification
- Audit hooks for sensitive AI actions

***

## First Milestone Architecture

Milestone 1 should include only:
- App shell
- Auth
- Tenant context
- RBAC base
- Services catalog
- Service detail
- Deployment action stubs

Milestone 2 adds:
- Docs upload
- Ingestion status
- Ask AI / RAG

Milestone 3 adds:
- Copilot
- Trace capture
- Observability dashboards

Milestone 4 adds:
- Evaluations
- API keys
- Audit log polish
- Settings hardening