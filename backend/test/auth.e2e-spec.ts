import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth System (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  const uniqueSuffix = Date.now();
  const testUser = {
    email: `test_e2e_${uniqueSuffix}@example.com`,
    password: 'Password123!',
    role: 'PARTICIPANT',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - Register', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(testUser)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toEqual(testUser.email);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200) // Login returns 200 OK
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        accessToken = res.body.access_token;
      });
  });

  it('/auth/login (POST) - Fail with wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword',
      })
      .expect(401);
  });
});
