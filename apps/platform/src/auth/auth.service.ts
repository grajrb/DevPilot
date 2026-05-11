import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService as IAuthService } from './interfaces/auth.service';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { ConfigService } from '@nestjs/config';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Partial<User>;
  token: TokenPair;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return user;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.validateUser(email, password);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    return {
      user: this.sanitizeUser(user),
      token: await this.generateTokenPair(user),
    };
  }

  async register(email: string, password: string, name: string, tenantId?: string): Promise<AuthResponse> {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({
      email,
      passwordHash,
      name,
      tenantId: tenantId || null,
    });

    const saved = await this.userRepo.save(user);
    const token = await this.generateTokenPair(saved);

    return {
      user: this.sanitizeUser(saved),
      token,
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verifyAsync(token);
      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
        relations: ['tenant', 'roles', 'roles.permissions'],
      });
      return user;
    } catch {
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const token = await this.refreshTokenRepo.findOne({
      where: { tokenHash: refreshToken },
      relations: ['user', 'user.roles', 'user.roles.permissions'],
    });

    if (!token || token.revokedAt || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old token
    token.revokedAt = new Date();
    await this.refreshTokenRepo.save(token);

    const newToken = await this.generateTokenPair(token.user);
    return {
      user: this.sanitizeUser(token.user),
      token: newToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await this.refreshTokenRepo.findOne({
      where: { tokenHash: refreshToken },
    });

    if (token) {
      token.revokedAt = new Date();
      await this.refreshTokenRepo.save(token);
    }
  }

  private async generateTokenPair(user: User): Promise<TokenPair> {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles.map(r => r.name),
      permissions: user.permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('jwt.expiresIn') || '15m',
    });

    const refreshTokenRaw = uuidv4();
    const refreshTokenHash = await bcrypt.hash(refreshTokenRaw, 12);

    await this.refreshTokenRepo.save({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
    };
  }

  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
