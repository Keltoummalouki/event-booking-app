import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Bookings System (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let participantToken: string;
  let eventId: string;
  let bookingId: string;
  const uniqueSuffix = Date.now();

  const adminUser = {
    email: `admin_bookings_${uniqueSuffix}@example.com`,
    password: 'Password123!',
    role: 'ADMIN',
  };

  const participantUser = {
    email: `user_bookings_${uniqueSuffix}@example.com`,
    password: 'Password123!',
    role: 'PARTICIPANT',
  };

  const eventData = {
    title: `Booking Test Event ${uniqueSuffix}`,
    description: 'Event for booking test',
    date: new Date(Date.now() + 86400000).toISOString(),
    location: 'Online',
    capacity: 10,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 1. Setup Admin
    await request(app.getHttpServer())
      .post('/users')
      .send(adminUser)
      .expect(201);
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: adminUser.email, password: adminUser.password })
      .expect(200);
    adminToken = adminLogin.body.access_token;

    // 2. Create and Publish Event
    const eventRes = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(eventData)
      .expect(201);
    eventId = eventRes.body.id;

    await request(app.getHttpServer())
      .patch(`/events/${eventId}/publish`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // 3. Setup Participant
    await request(app.getHttpServer())
      .post('/users')
      .send(participantUser)
      .expect(201);
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: participantUser.email,
        password: participantUser.password,
      })
      .expect(200);
    participantToken = userLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/bookings (POST) - Book Event', () => {
    return request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${participantToken}`)
      .send({ eventId })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.status).toEqual('PENDING'); // Or CONFIRMED if auto-confirm
        bookingId = res.body.id;
      });
  });

  it('/bookings/my-bookings (GET) - Check Booking', () => {
    return request(app.getHttpServer())
      .get('/bookings/my-bookings')
      .set('Authorization', `Bearer ${participantToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        const booking = res.body.find((b) => b.id === bookingId);
        expect(booking).toBeDefined();
        expect(booking.event.id).toEqual(eventId);
      });
  });

  it('/bookings/:id/cancel (PATCH) - Cancel Booking', () => {
    return request(app.getHttpServer())
      .patch(`/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${participantToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toEqual('CANCELED');
      });
  });

  it('/bookings/my-bookings (GET) - Verify Cancellation', () => {
    return request(app.getHttpServer())
      .get('/bookings/my-bookings')
      .set('Authorization', `Bearer ${participantToken}`)
      .expect(200)
      .expect((res) => {
        const booking = res.body.find((b) => b.id === bookingId);
        expect(booking.status).toEqual('CANCELED');
      });
  });
});
