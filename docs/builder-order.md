# DevPilot Build Order

## Guiding Principle

Build the project in vertical slices, starting with the authenticated product shell and the service catalog. Do not start with agents, fancy observability, or autonomous workflows.

***

## Phase 0 - Workspace and Specs

Goal:
- Turn the Stitch design into an implementation-ready project workspace.

Tasks:
- Create monorepo folders
- Add `docs/product/designs.md`
- Add `docs/product/screen-map.md`
- Add `docs/architecture/modules.md`
- Add `docs/api/contracts.md`
- Create `.env.example` files for each app later
- Decide naming conventions and package boundaries

Output:
- A clean repo structure with project documentation frozen before coding

***

## Phase 1 - App Shell and Foundations

Goal:
- Build the shared frontend shell and base backend skeletons.

Tasks:
- Create Next.js app shell
- Implement sidebar, header, search bar, notification slot, tenant switcher, user menu
- Add design tokens and typography from `designs.md`
- Set up NestJS skeleton modules
- Set up FastAPI skeleton modules
- Add shared types package

Output:
- Navigable authenticated shell with placeholder pages

***

## Phase 2 - Auth, Tenant Context, and RBAC

Goal:
- Make the app aware of the current user, tenant, and role.

Tasks:
- Build login flow
- Add current user endpoint
- Add tenant resolution
- Add role guard strategy
- Protect routes and server APIs
- Add audit hooks for privileged actions

Output:
- Users can log in and land inside a tenant-scoped shell

***

## Phase 3 - Services Catalog

Goal:
- Ship the first real business feature.

Tasks:
- Create services schema
- Build service list endpoint
- Build create service flow
- Build services page filters and table
- Add service search
- Add health and deployment summary fields

Output:
- Real services catalog page mapped to Stitch navigation

***

## Phase 4 - Service Detail and Deployment Actions

Goal:
- Add drill-down and operational actions.

Tasks:
- Build service detail endpoint
- Add deployment history section
- Add action endpoints for deploy / migrations
- Add linked docs / runbooks references
- Add service metadata cards and quick actions

Output:
- Service detail page with action-oriented workflows

***

## Phase 5 - Docs Knowledge Management

Goal:
- Introduce tenant-scoped document management.

Tasks:
- Add document upload intake
- Add storage metadata
- Add ingestion status model
- Build docs list page
- Show processing states and source types

Output:
- Docs page where users can upload and monitor knowledge ingestion

***

## Phase 6 - Ask AI / RAG

Goal:
- Deliver the first useful AI feature with citations.

Tasks:
- Add parsing and chunking pipeline
- Add embeddings and vector storage
- Build `POST /rag/query`
- Show chat answer with sources
- Capture latency and feedback basics

Output:
- Docs Ask AI chat page with source-backed answers

***

## Phase 7 - Copilot

Goal:
- Extend RAG into an engineering copilot.

Tasks:
- Add context-aware chat using tenant/team/environment/service
- Add service metadata enrichment
- Add tool wrappers such as get service details and trigger deploy stubs
- Show tool usage blocks and citations in the UI

Output:
- Copilot page that feels like an engineering workspace, not a generic chatbot

***

## Phase 8 - Observability and Trace Detail

Goal:
- Make AI behavior inspectable.

Tasks:
- Log LLM calls, cost, tokens, latency, status
- Build summary metrics endpoint
- Build traces list endpoint
- Build trace detail endpoint
- Add trace UI with drill-down panels

Output:
- Observability overview and trace detail screens

***

## Phase 9 - Evaluations

Goal:
- Add quality measurement and user feedback.

Tasks:
- Store thumbs up/down feedback
- Add evaluation result model
- Build evaluation summary endpoints
- Show score and trend views

Output:
- Evaluations screen with quality monitoring

***

## Phase 10 - Governance and Hardening

Goal:
- Make the product portfolio-ready.

Tasks:
- API keys management
- Full audit logs filters
- Settings pages
- Rate limiting
- Tenant isolation reviews
- Error states, empty states, skeleton polish
- Tests and CI/CD

Output:
- A credible production-style capstone with governance and polish

***

## Recommended Week 1 Focus

Only do these in Week 1:
- Repo structure
- Docs files
- App shell skeleton
- Shared types outline
- Backend skeletons
- Auth plan and service catalog plan

Do not do these in Week 1:
- Agents
- LangChain complexity
- Multi-model routing
- Advanced observability dashboards
- Terraform generation
- Real Jenkins automation

## First Demo Milestone

Your first demo should include:
- logged-in app shell
- sidebar + top header
- overview placeholder
- working services catalog
- service detail page
- deploy action stub

If that milestone looks polished, the rest of the project will build on a stable foundation.