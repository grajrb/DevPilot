import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepo: Repository<ApiKey>,
  ) {}

  async create(data: { name: string; userId: string; tenantId: string; scopes: string[]; expiresInDays?: number }) {
    const rawKey = `sk-dev-${uuidv4().replace(/-/g, '')}`;
    const keyHash = await bcrypt.hash(rawKey, 12);

    const apiKey = this.apiKeyRepo.create({
      ...data,
      keyPrefix: rawKey.slice(0, 12),
      keyHash,
      expiresAt: data.expiresInDays ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000) : undefined,
    });

    const saved = await this.apiKeyRepo.save(apiKey);

    return {
      ...saved,
      fullKey: rawKey, // Only returned once
    };
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    const all = await this.apiKeyRepo.find();
    for (const ak of all) {
      if (await bcrypt.compare(key, ak.keyHash)) {
        return ak;
      }
    }
    return null;
  }

  async findAllByTenant(tenantId: string) {
    return this.apiKeyRepo.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async revoke(id: string): Promise<void> {
    await this.apiKeyRepo.update(id, { isActive: false });
  }

  async delete(id: string): Promise<void> {
    await this.apiKeyRepo.delete(id);
  }
}
