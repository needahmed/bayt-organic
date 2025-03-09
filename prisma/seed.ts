import { PrismaClient, ProductStatus, Role } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Simple password hashing function for seeding
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Generate a MongoDB compatible ObjectId
const generateObjectId = (): string => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0')
  const machineId = crypto.randomBytes(3).toString('hex')
  const processId = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0')
  const counter = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')
  return timestamp + machineId + processId + counter
}

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashPassword('admin123'),
      role: Role.ADMIN,
    },
  })

  console.log('Created admin user:', adminUser.name)

  // Create customer user
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Test Customer',
      email: 'customer@example.com',
      password: hashPassword('customer123'),
      role: Role.CUSTOMER,
    },
  })

  console.log('Created customer user:', customerUser.name)

  // Create categories
  const soapCategory = await prisma.category.upsert({
    where: { slug: 'soaps' },
    update: {},
    create: {
      name: 'Soaps',
      slug: 'soaps',
      image: 'https://via.placeholder.com/300',
    },
  })

  const shampoosCategory = await prisma.category.upsert({
    where: { slug: 'shampoos' },
    update: {},
    create: {
      name: 'Shampoos',
      slug: 'shampoos',
      image: 'https://via.placeholder.com/300',
    },
  })

  const bodyCareCategory = await prisma.category.upsert({
    where: { slug: 'body-care' },
    update: {},
    create: {
      name: 'Body Care',
      slug: 'body-care',
      image: 'https://via.placeholder.com/300',
    },
  })

  console.log('Created categories')

  // Create collections
  const bestSellersCollection = await prisma.collection.upsert({
    where: { slug: 'best-sellers' },
    update: {},
    create: {
      name: 'Best Sellers',
      slug: 'best-sellers',
      description: 'Our most popular products',
      image: 'https://via.placeholder.com/300',
    },
  })

  const newArrivalsCollection = await prisma.collection.upsert({
    where: { slug: 'new-arrivals' },
    update: {},
    create: {
      name: 'New Arrivals',
      slug: 'new-arrivals',
      description: 'Our latest products',
      image: 'https://via.placeholder.com/300',
    },
  })

  console.log('Created collections')

  // Create products
  const charcoalSoapId = generateObjectId()
  const charcoalSoap = await prisma.product.upsert({
    where: { id: charcoalSoapId },
    update: {},
    create: {
      id: charcoalSoapId,
      name: 'Charcoal and Tree Body Soap',
      description: 'A natural soap made with activated charcoal to deeply cleanse and detoxify the skin.',
      price: 900,
      images: ['https://via.placeholder.com/600'],
      weight: '90 gram',
      ingredients: 'Activated Charcoal, Tea Tree Oil, Coconut Oil, Olive Oil, Shea Butter, Lye, Water',
      benefits: ['Detoxifies skin', 'Removes impurities', 'Natural antibacterial properties'],
      howToUse: 'Lather with water and apply to body. Rinse thoroughly.',
      stock: 25,
      status: ProductStatus.ACTIVE,
      categoryId: soapCategory.id,
      collectionIds: [bestSellersCollection.id, newArrivalsCollection.id],
    },
  })

  const honeySoapId = generateObjectId()
  const honeySoap = await prisma.product.upsert({
    where: { id: honeySoapId },
    update: {},
    create: {
      id: honeySoapId,
      name: 'Honey & Oats Body Soap',
      description: 'A nourishing soap made with honey and oats to soothe and moisturize the skin.',
      price: 1000,
      discountedPrice: 900,
      images: ['https://via.placeholder.com/600'],
      weight: '90 gram',
      ingredients: 'Honey, Oats, Beeswax, Shea Butter, Multani Mitti, Rosemary, Almond Oil, Castor Oil, Extra Virgin Olive Oil, Coconut Oil, Cinnamon essential oil, Citric Acid, Sugar, NaOH, distilled water and Lye.',
      benefits: ['Gently exfoliates dead skin cells', 'Moisturizes and nourishes the skin', 'Soothes irritated skin'],
      howToUse: 'Wet the soap and lather between your hands or on a washcloth. Apply to your body in circular motions, then rinse thoroughly.',
      stock: 18,
      status: ProductStatus.ACTIVE,
      categoryId: soapCategory.id,
      collectionIds: [bestSellersCollection.id],
    },
  })

  const shampooBarId = generateObjectId()
  const shampooBar = await prisma.product.upsert({
    where: { id: shampooBarId },
    update: {},
    create: {
      id: shampooBarId,
      name: 'Coconut Milk Shampoo Bar',
      description: 'A solid shampoo bar made with coconut milk to nourish and strengthen hair.',
      price: 1200,
      images: ['https://via.placeholder.com/600'],
      weight: '75 gram',
      ingredients: 'Coconut Milk, Castor Oil, Olive Oil, Cocoa Butter, Essential Oils, Lye, Water',
      benefits: ['Nourishes hair', 'Strengthens hair', 'Reduces plastic waste'],
      howToUse: 'Wet hair thoroughly. Rub the shampoo bar between your hands or directly onto your hair to create a lather. Massage into scalp and hair, then rinse thoroughly.',
      stock: 12,
      status: ProductStatus.ACTIVE,
      categoryId: shampoosCategory.id,
      collectionIds: [newArrivalsCollection.id],
    },
  })

  console.log('Created products')

  // Create an address for the customer
  const addressId = generateObjectId()
  const customerAddress = await prisma.address.upsert({
    where: { id: addressId },
    update: {},
    create: {
      id: addressId,
      userId: customerUser.id,
      name: 'Home',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
      isDefault: true,
    },
  })

  console.log('Created customer address')

  // Create a cart for the customer
  const customerCart = await prisma.cart.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
    },
  })

  console.log('Created customer cart')

  // Add a product to the customer's cart
  const cartItemId = generateObjectId()
  await prisma.cartItem.upsert({
    where: { id: cartItemId },
    update: {},
    create: {
      id: cartItemId,
      cartId: customerCart.id,
      productId: honeySoap.id,
      quantity: 1,
    },
  })

  console.log('Added item to customer cart')

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 