import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'test@devpilot.io',
          password: 'testpassword123',
          name: 'Test User',
        })
        .expect(201);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('test@devpilot.io');
      expect(res.body.token).toBeDefined();
      expect(res.body.token.accessToken).toBeDefined();
      expect(res.body.token.refreshToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'dupe@devpilot.io',
          password: 'testpassword123',
          name: 'Duplicate',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'dupe@devpilot.io',
          password: 'testpassword123',
          name: 'Duplicate',
        })
        .expect(409);
    });

    it('should reject invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: 'testpassword123',
          name: 'Invalid',
        })
        .expect(400);
    });

    it('should reject short password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'short@devpilot.io',
          password: '123',
          name: 'Short',
        })
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'login-test@devpilot.io',
          password: 'testpassword123',
          name: 'Login Test',
        });

      // Then login
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'login-test@devpilot.io',
          password: 'testpassword123',
        })
        .expect(200);

      expect(res.body.user).toBeDefined();
      expect(res.body.token.accessToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'login-test@devpilot.io',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should reject non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@devpilot.io',
          password: 'testpassword123',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user with valid token', async () => {
      const registerRes = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'me-test@devpilot.io',
          password: 'testpassword123',
          name: 'Me Test',
        });

      const res = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${registerRes.body.token.accessToken}`)
        .expect(200);

      expect(res.body.user.email).toBe('me-test@devpilot.io');
    });

    it('should reject without token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .expect(401);
    });

    it('should reject with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token-here')
        .expect(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh access token', async () => {
      const registerRes = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'refresh-test@devpilot.io',
          password: 'testpassword123',
          name: 'Refresh Test',
        });

      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: registerRes.body.token.refreshToken })
        .expect(200);

      expect(res.body.token.accessToken).toBeDefined();
      expect(res.body.token.refreshToken).toBeDefined();
    });

    it('should reject expired refresh token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-refresh-token' })
        .expect(401);
    });
  });
});