import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepo: Repository<Team>,
  ) {}

  async create(dto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepo.create(dto);
    return this.teamRepo.save(team);
  }

  async findById(id: string): Promise<Team | null> {
    return this.teamRepo.findOne({
      where: { id },
      relations: ['tenant', 'owner'],
    });
  }

  async findByTenant(tenantId: string): Promise<Team[]> {
    return this.teamRepo.find({
      where: { tenantId },
      relations: ['owner'],
    });
  }

  async update(id: string, dto: UpdateTeamDto): Promise<Team> {
    await this.teamRepo.update(id, dto);
    const team = await this.teamRepo.findOne({ where: { id } });
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }
    return team;
  }

  async delete(id: string): Promise<void> {
    await this.teamRepo.delete(id);
  }

  async addMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }
    if (!team.memberIds.includes(userId)) {
      team.memberIds = [...team.memberIds, userId];
      await this.teamRepo.save(team);
    }
    return team;
  }

  async removeMember(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }
    team.memberIds = team.memberIds.filter(id => id !== userId);
    await this.teamRepo.save(team);
    return team;
  }
}