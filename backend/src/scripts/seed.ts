import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Event, EventStatus } from '../events/entities/event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Database Seed Script
 * Creates an admin user and 10 test events with varied data
 *
 * Usage: npm run seed
 */

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '22062016',
  database: process.env.DB_NAME || 'event_booking_db',
  entities: [User, Event, Booking],
  synchronize: true,
});

// Sample event data with realistic scenarios
const SAMPLE_EVENTS = [
  {
    title: 'Tech Conference 2026',
    description:
      'Join industry leaders for a deep dive into AI, cloud computing, and the future of software development. Keynotes, workshops, and networking opportunities await.',
    location: 'Paris Expo, Hall A',
    capacity: 500,
    daysFromNow: 30,
    status: EventStatus.PUBLISHED,
  },
  {
    title: 'Startup Pitch Night',
    description:
      'Watch 10 promising startups pitch their innovative ideas to a panel of investors. Networking session and drinks included.',
    location: 'Station F, Paris',
    capacity: 150,
    daysFromNow: 14,
    status: EventStatus.PUBLISHED,
  },
  {
    title: 'Design Systems Workshop',
    description:
      'A hands-on workshop exploring modern design systems, component libraries, and the bridge between design and development teams.',
    location: 'WeWork La Défense',
    capacity: 40,
    daysFromNow: 7,
    status: EventStatus.PUBLISHED,
  },
  {
    title: 'Cloud Architecture Summit',
    description:
      'Expert speakers will cover microservices, Kubernetes, serverless architectures, and multi-cloud strategies for enterprise applications.',
    location: 'Convention Center Lyon',
    capacity: 300,
    daysFromNow: 45,
    status: EventStatus.PUBLISHED,
  },
  {
    title: 'Women in Tech Meetup',
    description:
      'Monthly gathering celebrating women in technology. This month: career growth strategies and mentorship sessions.',
    location: 'Microsoft France, Issy',
    capacity: 80,
    daysFromNow: 10,
    status: EventStatus.PUBLISHED,
  },
  {
    title: 'Cybersecurity Bootcamp',
    description:
      'Intensive 2-day bootcamp covering ethical hacking, penetration testing, and security best practices for developers.',
    location: 'Epitech Paris',
    capacity: 25,
    daysFromNow: 21,
    status: EventStatus.DRAFT,
  },
  {
    title: 'React & Next.js Masterclass',
    description:
      'From React fundamentals to advanced Next.js patterns. Learn SSR, App Router, Server Components, and performance optimization.',
    location: 'Le Wagon Paris',
    capacity: 60,
    daysFromNow: 5,
    status: EventStatus.PUBLISHED,
  },
  {
    title: 'Product Management Forum',
    description:
      'PMs and product leaders share insights on roadmap prioritization, user research, and cross-functional collaboration.',
    location: 'Numa Paris',
    capacity: 120,
    daysFromNow: 18,
    status: EventStatus.PUBLISHED,
  },
  {
    title: 'AI & Ethics Symposium',
    description:
      'Exploring the ethical implications of artificial intelligence. Panels on bias, transparency, and responsible AI development.',
    location: 'Sciences Po Paris',
    capacity: 200,
    daysFromNow: 60,
    status: EventStatus.DRAFT,
  },
  {
    title: 'DevOps Day Paris',
    description:
      'One-day conference on CI/CD pipelines, infrastructure as code, observability, and the DevOps culture transformation.',
    location: 'Dock Pullman',
    capacity: 250,
    daysFromNow: 35,
    status: EventStatus.PUBLISHED,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Initialize connection
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    const userRepository = AppDataSource.getRepository(User);
    const eventRepository = AppDataSource.getRepository(Event);

    // Check if admin already exists
    let admin = await userRepository.findOne({
      where: { email: 'admin@gmail.com' },
    });

    if (!admin) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('password123', 10);
      admin = userRepository.create({
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await userRepository.save(admin);
      console.log('👤 Created admin user: admin@gmail.com / password123');
    } else {
      console.log('👤 Admin user already exists');
    }

    // Check if participant exists
    let participant = await userRepository.findOne({
      where: { email: 'participant@gmail.com' },
    });

    if (!participant) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      participant = userRepository.create({
        email: 'participant@gmail.com',
        password: hashedPassword,
        role: UserRole.PARTICIPANT,
      });
      await userRepository.save(participant);
      console.log(
        '👤 Created participant user: participant@gmail.com / password123',
      );
    } else {
      console.log('👤 Participant user already exists');
    }

    // Check existing events count
    const existingCount = await eventRepository.count();
    if (existingCount >= 10) {
      console.log(
        `\n📅 ${existingCount} events already exist. Skipping event creation.`,
      );
    } else {
      // Create events
      console.log('\n📅 Creating 10 test events...\n');

      for (const eventData of SAMPLE_EVENTS) {
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + eventData.daysFromNow);
        eventDate.setHours(18, 0, 0, 0); // 6 PM

        const event = eventRepository.create({
          title: eventData.title,
          description: eventData.description,
          date: eventDate,
          location: eventData.location,
          capacity: eventData.capacity,
          status: eventData.status,
          organizer: admin,
        });

        await eventRepository.save(event);
        const statusIcon =
          eventData.status === EventStatus.PUBLISHED ? '🟢' : '🟡';
        console.log(`   ${statusIcon} ${eventData.title}`);
      }
    }

    console.log('\n✨ Seed completed successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Test Credentials:');
    console.log('   Admin:       admin@gmail.com / password123');
    console.log('   Participant: participant@gmail.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
