import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Events System (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let createdEventId: string;
    const uniqueSuffix = Date.now();
    const adminUser = {
        email: `admin_e2e_${uniqueSuffix}@example.com`,
        password: 'Password123!',
        role: 'ADMIN',
    };
    const eventData = {
        title: `E2E Event ${uniqueSuffix}`,
        description: 'An event for testing',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        location: 'Paris',
        capacity: 100,
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Register Admin
        await request(app.getHttpServer())
            .post('/users')
            .send(adminUser)
            .expect(201);

        // Login Admin
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: adminUser.email, password: adminUser.password })
            .expect(200);

        adminToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/events (POST) - Create Event (Admin)', () => {
        return request(app.getHttpServer())
            .post('/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(eventData)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.title).toEqual(eventData.title);
                createdEventId = res.body.id;
            });
    });

    it('/events/:id/publish (PATCH) - Publish Event (Admin)', () => {
        return request(app.getHttpServer())
            .patch(`/events/${createdEventId}/publish`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.status).toEqual('PUBLISHED');
            });
    });

    it('/events/public (GET) - Retrieve Public Events', () => {
        return request(app.getHttpServer())
            .get('/events/public')
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                const event = res.body.find((e) => e.id === createdEventId);
                expect(event).toBeDefined();
                expect(event.title).toEqual(eventData.title);
            });
    });
});
