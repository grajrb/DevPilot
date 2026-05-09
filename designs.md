# DevPilot UI Design System

## Product
DevPilot is a multi-tenant internal developer platform for engineering teams.
It combines:
- Service catalog
- Deployment self-service
- RAG documentation search
- AI copilot
- LLM observability
- Evaluation dashboards
- RBAC and tenant settings

## UI Goals
- Feel like a real enterprise SaaS, not a marketing site
- Dense but clean
- Trustworthy, technical, operational
- Looks close to Linear + Vercel + Datadog + Backstage
- Minimal visual noise
- Serious, premium, developer-first

## Style
- Desktop-first web app
- Compact typography
- Left sidebar navigation
- Sticky top header
- Card-based content areas
- Clean tables
- Dark mode first, but support light mode too
- No glowing gradients
- No glassmorphism
- No rounded toy-like UI
- No 3-column “AI template” landing page look

## Color
- Background: graphite / warm neutral dark
- Surface: slightly lighter slate panels
- Primary accent: teal
- Secondary accent: indigo only for charts and traces
- Success: muted green
- Warning: amber
- Error: rose/red
- Borders: subtle low-contrast strokes

## Typography
- Sans-serif only
- Tight, product-style hierarchy
- Small labels, medium body, compact headings
- Tabular numbers for metrics, costs, latency, token counts

## Components
- Sidebar with icons + labels
- Top command/search bar
- KPI cards
- Table with filters and sticky header
- Trace timeline
- Chat panel with source citations
- Right-side inspector drawer
- Status badges
- Tenant switcher
- Role badges
- Empty states and skeleton loaders

## App Sections
- Overview
- Services
- Docs
- Copilot
- Observability
- Evaluations
- API Keys
- Audit Logs
- Settings

## Screen Rules
- One primary action per screen
- Filters always visible above tables
- Charts in middle section, detail tables below
- Keep copy short and operational
- Use badges for status
- Never hide important actions in hover-only menus

## Tone Words
- precise
- operational
- trustworthy
- modern
- technical
- premium
- structured

## Anti-Patterns
- giant hero sections
- bright purple gradients
- soft startup illustrations
- centered-everything layout
- oversized typography
- oversized cards
- generic SaaS marketing visuals