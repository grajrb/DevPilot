# DevPilot UI Design System

## Product

DevPilot is a multi-tenant internal developer platform for engineering teams. It combines:

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
- Dark mode first, with light mode support later
- No glowing gradients
- No glassmorphism
- No rounded toy-like UI
- No 3-column AI-template landing page look

## Navigation

Primary sections:

- Overview
- Services
- Docs
- Copilot
- Observability
- Evaluations
- API Keys
- Audit Logs
- Settings

Secondary utilities:

- Support
- Status
- Global search / command bar
- Notifications
- Settings shortcut
- User menu / profile

Primary CTA:

- Deploy New Service

## Color System

- Background: graphite / warm neutral dark
- Surface: slightly lighter slate panels
- Primary accent: teal
- Secondary accent: indigo only for charts and traces
- Success: muted green
- Warning: amber
- Error: rose/red
- Borders: subtle low-contrast strokes

### Tokens

- Primary: `#14B8A6`
- Secondary: `#6366F1`
- Tertiary: `#F38764`
- Neutral: `#727876`

## Typography

- Headline: Geist
- Body: Inter
- Label / technical metadata: JetBrains Mono
- Sans-serif only
- Tight, product-style hierarchy
- Small labels, medium body, compact headings
- Tabular numbers for metrics, costs, latency, and token counts

## Core Components

- Sidebar with icons and labels
- Sticky top command/search bar
- KPI cards
- Table with filters and sticky header
- Trace timeline
- Chat panel with source citations
- Right-side inspector drawer
- Status badges
- Tenant switcher
- Role badges
- Empty states
- Skeleton loaders

## Screen Rules

- One primary action per screen
- Filters should remain visible above tables
- Charts should sit in the middle area, with detail tables below
- Keep copy short and operational
- Use badges for status
- Never hide important actions in hover-only menus
- Chat answers must show citations and source context
- Trace and observability views must emphasize scannability over decoration

## Tone Words

- precise
- operational
- trustworthy
- modern
- technical
- premium
- structured

## Anti-Patterns

- Giant hero sections
- Bright purple gradients
- Soft startup illustrations
- Centered-everything layout
- Oversized typography
- Oversized cards
- Generic SaaS marketing visuals

## Interaction Notes

- The Copilot experience should feel like a production engineering workspace, not a consumer chatbot.
- Service-aware context should remain visible while chatting.
- Observability and trace views should expose technical details, tool usage, and drill-down paths.
- Services and operational tables should optimize for dense scanning and quick action.