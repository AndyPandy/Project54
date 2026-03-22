import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'changeme123'

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        name: 'Admin',
        role: 'admin',
      },
    })
    console.log(`✓ Admin user created: ${adminEmail}`)
  } else {
    console.log(`  Admin user already exists: ${adminEmail}`)
  }

  // Seed demo listings
  const demos = [
    {
      slug: 'modern-2br-city-centre',
      title: 'Modern 2-Bedroom in City Centre',
      description:
        'Bright, recently renovated apartment in the heart of the city. Features open-plan kitchen/living, two double bedrooms, and a private balcony overlooking the square. Walking distance to shops, cafes, and public transport.',
      price: 2200,
      address: '14 Market Square, City Centre',
      latitude: 59.3293,
      longitude: 18.0686,
      rooms: 2,
      sizeSqm: 68,
      status: 'published',
      listingType: 'rent',
      images: JSON.stringify([]),
    },
    {
      slug: 'spacious-3br-family-home',
      title: 'Spacious 3-Bedroom Family Apartment',
      description:
        'Generous family apartment in a quiet residential neighbourhood. Large living room, updated kitchen, three bedrooms, two bathrooms, and access to a shared garden. Excellent school catchment area.',
      price: 3100,
      address: '5 Maple Street, Northside',
      latitude: 59.3393,
      longitude: 18.0586,
      rooms: 3,
      sizeSqm: 102,
      status: 'published',
      listingType: 'rent',
      images: JSON.stringify([]),
    },
    {
      slug: 'cosy-studio-south-end',
      title: 'Cosy Studio — South End',
      description:
        'Efficiently designed studio apartment perfect for singles or couples. Clever storage solutions, modern bathroom, and a fully equipped kitchen. Great transport links into the city.',
      price: 1350,
      address: '31 River Lane, South End',
      latitude: 59.3193,
      longitude: 18.0786,
      rooms: 1,
      sizeSqm: 38,
      status: 'published',
      listingType: 'rent',
      images: JSON.stringify([]),
    },
    {
      slug: 'luxury-penthouse-harbour-view',
      title: 'Luxury Penthouse — Harbour View',
      description:
        'Stunning top-floor apartment with 180° harbour views. Floor-to-ceiling windows, premium finishes throughout, chef\'s kitchen, master suite with en-suite, and a wraparound terrace. Underground parking included.',
      price: 1250000,
      address: '1 Harbour Tower, Waterfront',
      latitude: 59.3243,
      longitude: 18.0886,
      rooms: 4,
      sizeSqm: 180,
      status: 'published',
      listingType: 'sale',
      images: JSON.stringify([]),
    },
    {
      slug: 'bright-1br-east-village',
      title: 'Bright 1-Bedroom — East Village',
      description:
        'Well-maintained one-bedroom apartment in a popular neighbourhood. South-facing living room, separate bedroom, and a fully tiled bathroom. Ideal for young professionals.',
      price: 1750,
      address: '22 Park Road, East Village',
      latitude: 59.3353,
      longitude: 18.0786,
      rooms: 1,
      sizeSqm: 52,
      status: 'draft',
      listingType: 'rent',
      images: JSON.stringify([]),
    },
  ]

  for (const demo of demos) {
    const exists = await prisma.apartment.findUnique({ where: { slug: demo.slug } })
    if (!exists) {
      await prisma.apartment.create({ data: demo })
      console.log(`✓ Listing created: ${demo.title}`)
    } else {
      console.log(`  Listing already exists: ${demo.title}`)
    }
  }

  console.log('\nSeed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
