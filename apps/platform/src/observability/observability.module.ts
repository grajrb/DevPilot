import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservabilityController } from './observability.controller';
import { ObservabilityService } from './observability.service';
import { LLMCall } from './entities/llm-call.entity';
import { Trace, TraceSpan } from './entities/trace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LLMCall, Trace, TraceSpan])],
  controllers: [ObservabilityController],
  providers: [ObservabilityService],
  exports: [ObservabilityService],
})
export class ObservabilityModule {}
