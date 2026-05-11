import { DataSource } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../roles/entities/permission.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { Service, ServiceEndpoint } from '../services/entities/service.entity';
import { Documentation } from '../docs/entities/documentation.entity';
import { Dataset, Evaluation, EvaluationRun, EvaluationResult } from '../evaluations/entities/evaluation.entity';
import { LLMCall } from '../observability/entities/llm-call.entity';
import { Trace, TraceSpan } from '../observability/entities/trace.entity';
import { ChatSession, ChatMessage } from '../copilot/entities/chat-session.entity';
import { Vector } from '../vector/entities/vector.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT']) || 5432,
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'postgres',
  database: process.env['DB_NAME'] || 'devpilot',
  entities: [
    Tenant,
    User,
    Role,
    Permission,
    RefreshToken,
    ApiKey,
    AuditLog,
    Service,
    ServiceEndpoint,
    Documentation,
    Dataset,
    Evaluation,
    EvaluationRun,
    EvaluationResult,
    LLMCall,
    Trace,
    TraceSpan,
    ChatSession,
    ChatMessage,
    Vector,
  ],
  migrations: ['src/database/migrations/**/*{.ts,.js}'],
  synchronize: process.env['NODE_ENV'] !== 'production',
  logging: process.env['NODE_ENV'] === 'development',
  extra: {
    connectionLimit: parseInt(process.env['DB_POOL_MAX']) || 20,
  },
});
