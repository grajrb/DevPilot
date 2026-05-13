import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { RolesModule } from './roles/roles.module';
import { RBACModule } from './rbac/rbac.module';
import { ServicesModule } from './services/services.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { AuditModule } from './audit/audit.module';
import { DocsModule } from './docs/docs.module';
import { ObservabilityModule } from './observability/observability.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { CopilotModule } from './copilot/copilot.module';
import { VectorModule } from './vector/vector.module';
import { TeamsModule } from './teams/teams.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { SettingsModule } from './settings/settings.module';
import { RedisCacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';

// Config
import configuration from './config/configuration';

// Common
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env['DB_HOST'] || 'localhost',
        port: parseInt(process.env['DB_PORT'], 10) || 5432,
        username: process.env['DB_USERNAME'] || 'postgres',
        password: process.env['DB_PASSWORD'] || 'postgres',
        database: process.env['DB_NAME'] || 'devpilot',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
        migrationsRun: process.env['NODE_ENV'] === 'production',
        synchronize: process.env['NODE_ENV'] !== 'production',
        logging: process.env['NODE_ENV'] === 'development',
        extra: {
          connectionLimit: parseInt(process.env['DB_POOL_MAX'], 10) || 20,
        },
      }),
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env['JWT_SECRET'] || 'change-me-in-production',
        signOptions: {
          expiresIn: process.env['JWT_EXPIRES_IN'] || '15m',
        },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ScheduleModule.forRoot(),

    // Application modules
    CommonModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    RolesModule,
    RBACModule.forRoot(),
    ServicesModule,
    ApiKeysModule,
    AuditModule,
    DocsModule,
    ObservabilityModule,
    EvaluationsModule,
    CopilotModule,
    VectorModule,
    TeamsModule,
    DeploymentsModule,
    SettingsModule,
    RedisCacheModule,
    QueueModule,
  ],
})
export class AppModule {}