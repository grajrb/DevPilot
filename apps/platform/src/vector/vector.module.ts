import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VectorService } from './vector.service';
import { Vector } from './entities/vector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vector])],
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}
