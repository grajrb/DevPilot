import { CacheModule, Module } from '@nestjs/common';
import { RedisModule } from '@nestjs/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        host: config.get<string>('redis.host'),
        port: config.get<number>('redis.port'),
        password: config.get<string>('redis.password'),
        db: config.get<number>('redis.db'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule, RedisModule],
})
export class CacheModule {} // Re-export from Nest
