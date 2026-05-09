# DevPilot Screen Map

## App Shell

### Authenticated App Shell

Purpose:
- Shared layout for all logged-in users.
- Establish navigation, search, notifications, profile, and tenant-aware context.

Key UI areas:
- Left sidebar with product branding and main navigation
- Sticky top header with global search / command palette
- Notifications and settings shortcuts
- Main content area
- Persistent primary CTA: Deploy New Service

Depends on:
- Authentication session
- Current tenant / org context
- User role

***

## Primary Screens

### 1. Overview Dashboard

Purpose:
- Show system status and high-level operational metrics for the selected cluster / tenant.

Visible widgets from Stitch:
- Active Services KPI
- Deployments (24H) KPI
- System Error Rate KPI
- Copilot Actions KPI
- Recent Deployments table
- Copilot Activity feed

Likely actions:
- View all deployments
- Drill into service details
- Open full copilot activity log

Data needs:
- Service counts
- Deployment summaries
- Error rate summary
- Copilot event summaries

***

### 2. Services Catalog

Purpose:
- Central inventory of services owned by teams inside the platform.

Expected content:
- Service table or grid
- Search and filters
- Ownership, repo, runtime, environment, health, deployment status
- Entry point into individual service detail pages

Primary action:
- Register or deploy a new service

Data needs:
- Services list
- Team ownership
- Runtime metadata
- Health / deployment state

***

### 3. Service Detail: `auth-service`

Purpose:
- Detailed operational view for one service.

Expected areas:
- Service identity and metadata
- Owners and repo links
- Environment and runtime data
- Deployment history
- Runbooks / docs / dependencies
- Quick operational actions

Likely actions:
- Trigger deploy
- Run migration
- View docs
- View observability traces
- Ask copilot about this service

***

### 4. Docs: Knowledge Management

Purpose:
- Manage uploaded internal documentation and tenant-scoped knowledge.

Expected areas:
- Document list
- Upload action
- Ingestion status
- Source type and metadata
- Chunk / indexing visibility

Data needs:
- Documents
- Ingestion job status
- Tenant-scoped access control

***

### 5. Docs: Ask AI Chat

Purpose:
- Query internal docs through a retrieval-augmented chat interface.

Expected areas:
- Chat thread
- Source citations
- Retrieved snippets / sources
- Prompt input
- Potential service or tenant context selectors

Data needs:
- Retrieval results
- Answer citations
- Feedback on answer quality

***

### 6. Copilot: Platform Engineering AI

Purpose:
- Operational copilot for engineers to ask about infra, services, logs, and workflows.

Visible elements from Stitch:
- Chat feed
- Service-aware answer blocks
- Source list
- Suggested prompt workflows
- Input box asking about infrastructure, code, or logs
- Warning text reminding users to verify critical changes

Expected supporting panels:
- Current tenant/team/environment/service context
- Retrieved documents and service metadata
- Tool/action logs

Data needs:
- RAG sources
- Service metadata
- Tool-call results
- User feedback

***

### 7. Observability: Monitoring & Traces

Purpose:
- Show platform and LLM behavior through metrics, traces, costs, and latency.

Expected areas:
- KPI cards
- Trend charts
- Trace tables
- Filters by tenant, service, model, environment, and time range

Data needs:
- Request logs
- Token / cost metrics
- Latency percentiles
- Error rates
- Retrieval metrics

***

### 8. Observability: Trace Detail

Purpose:
- Drill into one LLM or workflow execution.

Expected areas:
- Prompt / input
- Retrieved context
- Tool calls
- Model output
- Evaluation result
- Feedback status
- Latency and cost details

Data needs:
- Trace graph / steps
- Request-response payload metadata
- Retrieval attachments
- Eval outputs

***

### 9. Evaluations

Purpose:
- Review quality signals for copilot and RAG outputs.

Expected areas:
- User feedback summaries
- Hallucination / quality flags
- Evaluation trends
- Dataset / sample evaluation runs

Data needs:
- Manual feedback
- Automated eval jobs
- Score histories

***

### 10. API Keys

Purpose:
- Manage tenant-scoped or user-scoped keys for integrations and platform usage.

Expected areas:
- Key list
- Create / revoke actions
- Last used timestamps
- Scope / permission metadata

***

### 11. Audit Logs

Purpose:
- Record admin and operational actions across the platform.

Expected areas:
- Filterable event table
- Actor, action, entity, time, metadata
- Security and compliance visibility

***

### 12. Settings

Purpose:
- Tenant and user settings, preferences, roles, integrations, and environment configuration.

Expected areas:
- Tenant settings
- User preferences
- Role / access controls
- Integration settings

***

## Navigation to Route Mapping

Suggested route map:

- `/overview`
- `/services`
- `/services/[serviceId]`
- `/docs`
- `/docs/ask`
- `/copilot`
- `/observability`
- `/observability/traces/[traceId]`
- `/evaluations`
- `/api-keys`
- `/audit-logs`
- `/settings`

## Release Order

Build in this order:
1. Authenticated app shell
2. Overview dashboard
3. Services catalog
4. Service detail
5. Docs knowledge management
6. Docs ask AI chat
7. Copilot
8. Observability overview
9. Trace detail
10. Evaluations
11. API keys
12. Audit logs
13. Settings