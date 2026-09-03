import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const platforms = [
  {
    name: 'GitHub',
    slug: 'github',
  },
  {
    name: 'Instagram',
    slug: 'instagram',
  },
  {
    name: 'X',
    slug: 'x',
  },
  {
    name: 'Facebook',
    slug: 'facebook',
  },
  {
    name: 'TikTok',
    slug: 'tiktok',
  },
  {
    name: 'Twitch',
    slug: 'twitch',
  },
  {
    name: 'Kick',
    slug: 'kick',
  },
  {
    name: 'YouTube',
    slug: 'youtube',
  },
  {
    name: 'LinkedIn',
    slug: 'linkedin',
  },
  {
    name: 'Discord',
    slug: 'discord',
  },
  {
    name: 'Reddit',
    slug: 'reddit',
  },
  {
    name: 'Spotify',
    slug: 'spotify',
  },
  {
    name: 'Website',
    slug: 'website',
  },
  {
    name: 'Email',
    slug: 'email',
  },
];

async function main() {
  for (const platform of platforms) {
    await prisma.platform.upsert({
      where: {
        slug: platform.slug,
      },
      update: {
        name: platform.name,
      },
      create: platform,
    });
  }

  console.log('Platforms seeded successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
