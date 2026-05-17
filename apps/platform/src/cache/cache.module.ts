import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  exports: [],
})
export class RedisCacheModule {}