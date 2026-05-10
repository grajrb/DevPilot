# DevPilot

**Production-grade internal developer platform with AI copilot and LLM observability**

## Architecture

DevPilot is a multi-tenant platform built with a microservices architecture:

- **Frontend**: Next.js 14 with TypeScript, TailwindCSS, React Query
- **Platform Backend**: NestJS with TypeORM, PostgreSQL, Redis
- **AI Backend**: FastAPI with OpenAI/Anthropic providers, pgvector
- **Infrastructure**: Docker Compose for local dev, Kubernetes for production

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

### Local Development

1. Clone the repository
2. Copy `.env.example` to `.env.local` and configure
3. Start all services:
   ```bash
   pnpm run docker:up
   ```
4. Run database migrations:
   ```bash
   pnpm run db:migrate --filter=@devpilot/platform
   ```
5. Access the application:
   - Frontend: http://localhost:3000
   - Platform API: http://localhost:3001/api/v1
   - AI API: http://localhost:8000/api/v1
   - API Docs: http://localhost:8000/docs

### Development Scripts

```bash
# Install dependencies
pnpm install

# Run all services in development
pnpm dev

# Run specific service
pnpm --filter=@devpilot/web dev
pnpm --filter=@devpilot/platform start:dev
pnpm --filter=@devpilot/ai python -m uvicorn app.main:app --reload

# Run tests
pnpm test

# Type checking
pnpm type-check

# Lint
pnpm lint

# Build all
pnpm build
```

## Project Structure

```
devpilot/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── platform/         # NestJS backend
│   └── ai/               # FastAPI backend
├── packages/
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configuration
├── databases/
│   └── migrations/       # SQL migration scripts
├── infrastructure/
│   ├── docker/           # Docker Compose files
│   ├── k8s/              # Kubernetes manifests
│   └── terraform/        # IaC for cloud infra
└── docs/                 # Architecture and API docs
```

## Features

### Multi-Tenancy
- Complete tenant isolation at database level (RLS)
- JWT-based authentication with per-tenant context
- Row-level security enforced via PostgreSQL

### AI Copilot
- Multi-provider LLM routing (OpenAI, Anthropic, Azure)
- Streaming chat via Server-Sent Events
- Chat session persistence and management

### Observability
- LLM call logging with token usage and cost tracking
- Distributed tracing with OpenTelemetry
- Real-time metrics dashboards

### Evaluations
- Dataset-driven evaluation runs
- Configurable metrics (correctness, relevance, faithfulness)
- Batch processing with BullMQ queues

### RAG (Retrieval-Augmented Generation)
- pgvector for embeddings storage
- HNSW indexing for fast similarity search
- Support for multiple embedding providers

## Configuration

Key environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing secret | dev-secret |
| `DB_HOST` | PostgreSQL host | localhost |
| `REDIS_HOST` | Redis host | localhost |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `ANTHROPIC_API_KEY` | Anthropic API key | - |

## Security

- JWT with short-lived access tokens (15 min) and refresh tokens (7 days)
- API keys with scoped permissions and expiration
- Comprehensive audit logging for all mutations
- Row-level security (RLS) in PostgreSQL
- PII detection and redaction in LLM flows

## License

MIT
