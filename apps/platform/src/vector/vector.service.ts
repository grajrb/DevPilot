import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vector } from './entities/vector.entity';

@Injectable()
export class VectorService {
  constructor(
    @InjectRepository(Vector)
    private vectorRepo: Repository<Vector>,
  ) {}

  async create(data: {
    tenantId: string;
    collectionId: string;
    embedding: number[];
    content: string;
    metadata: Record<string, any>;
    chunkCount: number;
  }) {
    const vector = this.vectorRepo.create(data);
    return this.vectorRepo.save(vector);
  }

  async similaritySearch(tenantId: string, collectionId: string, queryEmbedding: number[], limit: number = 10) {
    // Use pgvector's cosine similarity search
    const results = await this.vectorRepo
      .createQueryBuilder('vector')
      .select([
        'vector.id',
        'vector.content',
        'vector.metadata',
        '1 - (vector.embedding <=> :queryEmbedding) as similarity',
      ])
      .where('vector.tenantId = :tenantId', { tenantId })
      .andWhere('vector.collectionId = :collectionId', { collectionId })
      .setParameter('queryEmbedding', queryEmbedding)
      .orderBy('similarity', 'DESC')
      .limit(limit)
      .getRawMany();

    return results;
  }

  async deleteByCollection(collectionId: string, tenantId: string) {
    await this.vectorRepo.delete({ collectionId, tenantId });
  }

  async findByCollection(collectionId: string, tenantId: string) {
    return this.vectorRepo.find({
      where: { collectionId, tenantId },
    });
  }
}
