import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Tenant } from '../tenants/entities/tenant.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../roles/entities/permission.entity';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { Service } from '../services/entities/service.entity';
import { Documentation } from '../docs/entities/documentation.entity';
import { Evaluation } from '../evaluations/entities/evaluation.entity';
import { EvaluationRun } from '../evaluations/entities/evaluation-run.entity';
import { EvaluationResult } from '../evaluations/entities/evaluation-result.entity';
import { Dataset } from '../evaluations/entities/dataset.entity';
import { LLMCall } from '../observability/entities/llm-call.entity';
import { Trace } from '../observability/entities/trace.entity';
import { TraceSpan } from '../observability/entities/trace-span.entity';
import { ChatSession } from '../copilot/entities/chat-session.entity';
import { ChatMessage } from '../copilot/entities/chat-message.entity';
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
              ApiKey,
              AuditLog,
              Service,
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
