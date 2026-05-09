---
name: DevPilot Design System
colors:
  surface: '#0e1513'
  surface-dim: '#0e1513'
  surface-bright: '#343b39'
  surface-container-lowest: '#090f0e'
  surface-container-low: '#161d1b'
  surface-container: '#1a211f'
  surface-container-high: '#252b2a'
  surface-container-highest: '#2f3634'
  on-surface: '#dde4e1'
  on-surface-variant: '#bbcac6'
  inverse-surface: '#dde4e1'
  inverse-on-surface: '#2b3230'
  outline: '#859490'
  outline-variant: '#3c4947'
  surface-tint: '#4fdbc8'
  primary: '#4fdbc8'
  on-primary: '#003731'
  primary-container: '#14b8a6'
  on-primary-container: '#00423b'
  inverse-primary: '#006b5f'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ffb59e'
  on-tertiary: '#5e1800'
  tertiary-container: '#f38764'
  on-tertiary-container: '#6c2106'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#71f8e4'
  primary-fixed-dim: '#4fdbc8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59e'
  on-tertiary-fixed: '#3a0b00'
  on-tertiary-fixed-variant: '#7c2d11'
  background: '#0e1513'
  on-background: '#dde4e1'
  surface-variant: '#2f3634'
  bg-graphite: '#121212'
  surface-slate: '#1E293B'
  border-subtle: '#2D3748'
  success-muted: '#059669'
  warning-amber: '#D97706'
  error-rose: '#E11D48'
  text-primary: '#F8FAFC'
  text-secondary: '#94A3B8'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-tabular:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar-width: 240px
  header-height: 56px
  gutter: 1rem
  container-padding: 1.5rem
  stack-gap: 0.75rem
---

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