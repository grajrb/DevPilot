import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'single',
        url: `redis://${config.get<string>('redis.host') || 'localhost'}:${config.get<number>('redis.port') || 6379}`,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RedisModule],
})
export class RedisCacheModule {}
