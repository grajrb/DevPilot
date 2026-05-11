import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Tenant } from '../tenants/entities/tenant.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../roles/entities/permission.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { Service, ServiceEndpoint } from '../services/entities/service.entity';
import { Documentation } from '../docs/entities/documentation.entity';
import { Evaluation, EvaluationRun, EvaluationResult, Dataset } from '../evaluations/entities/evaluation.entity';
import { LLMCall } from '../observability/entities/llm-call.entity';
import { Trace, TraceSpan } from '../observability/entities/trace.entity';
import { ChatSession, ChatMessage } from '../copilot/entities/chat-session.entity';
import { Vector } from '../vector/entities/vector.entity';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('db.host'),
            port: config.get<number>('db.port'),
            username: config.get<string>('db.username'),
            password: config.get<string>('db.password'),
            database: config.get<string>('db.name'),
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
              Evaluation,
              EvaluationRun,
              EvaluationResult,
              Dataset,
              LLMCall,
              Trace,
              TraceSpan,
              ChatSession,
              ChatMessage,
              Vector,
            ],
            synchronize: config.get<string>('nodeEnv') !== 'production',
            logging: config.get<string>('nodeEnv') === 'development',
          }),
          inject: [ConfigService],
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
