import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { Documentation } from './entities/documentation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documentation])],
  controllers: [DocsController],
  providers: [DocsService],
  exports: [DocsService],
})
export class DocsModule {}
