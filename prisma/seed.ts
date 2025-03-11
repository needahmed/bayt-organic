const { PrismaClient, ProductStatus, Role } = require('@prisma/client')
const cryptoNode = require('crypto')

const prisma = new PrismaClient()

// Simple password hashing function for seeding
const hashPassword = (password: string): string => {
  return cryptoNode.createHash('sha256').update(password).digest('hex')
}

// Generate a MongoDB compatible ObjectId
const generateObjectId = (): string => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0')
  const machineId = cryptoNode.randomBytes(3).toString('hex')
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
      image: '/placeholder.jpg',
    },
  })

  const shampoosCategory = await prisma.category.upsert({
    where: { slug: 'shampoos' },
    update: {},
    create: {
      name: 'Shampoos',
      slug: 'shampoos',
      image: '/placeholder.jpg',
    },
  })

  const bodyCareCategory = await prisma.category.upsert({
    where: { slug: 'body-care' },
    update: {},
    create: {
      name: 'Body Care',
      slug: 'body-care',
      image: '/placeholder.jpg',
    },
  })

  const accessoriesCategory = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'accessories',
      image: '/placeholder.jpg',
    },
  })

  const conditionersCategory = await prisma.category.upsert({
    where: { slug: 'conditioners' },
    update: {},
    create: {
      name: 'Conditioners',
      slug: 'conditioners',
      image: '/placeholder.jpg',
    },
  })

  const bodyWashCategory = await prisma.category.upsert({
    where: { slug: 'body-wash' },
    update: {},
    create: {
      name: 'Body Wash',
      slug: 'body-wash',
      image: '/placeholder.jpg',
    },
  })

  console.log('Created categories')

  // Create collections
  const summerCollection = await prisma.collection.upsert({
    where: { slug: 'summer-collection' },
    update: {},
    create: {
      name: 'Summer Collection',
      slug: 'summer-collection',
      image: '/placeholder.jpg',
    },
  })

  const winterCollection = await prisma.collection.upsert({
    where: { slug: 'winter-collection' },
    update: {},
    create: {
      name: 'Winter Collection',
      slug: 'winter-collection',
      image: '/placeholder.jpg',
    },
  })

  const bestSellersCollection = await prisma.collection.upsert({
    where: { slug: 'best-sellers' },
    update: {},
    create: {
      name: 'Best Sellers',
      slug: 'best-sellers',
      image: '/placeholder.jpg',
    },
  })

  const newArrivalsCollection = await prisma.collection.upsert({
    where: { slug: 'new-arrivals' },
    update: {},
    create: {
      name: 'New Arrivals',
      slug: 'new-arrivals',
      image: '/placeholder.jpg',
    },
  })

  const premiumCollection = await prisma.collection.upsert({
    where: { slug: 'premium' },
    update: {},
    create: {
      name: 'Premium',
      slug: 'premium',
      description: 'Our premium quality products',
      image: '/placeholder.jpg',
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
      images: ['/placeholder.jpg'],
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
      images: ['/placeholder.jpg'],
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

  const milkSoapId = generateObjectId()
  const milkSoap = await prisma.product.upsert({
    where: { id: milkSoapId },
    update: {},
    create: {
      id: milkSoapId,
      name: 'Milk Soap',
      description: 'Enriched with Cow milk, Yogurt, and a blend of essential oils.',
      price: 900,
      images: ['/placeholder.jpg'],
      weight: '100 gram',
      ingredients: 'Cow milk, Yogurt, Coconut Oil, Olive Oil, Essential Oils, Lye, Water',
      benefits: ['Nourishes skin', 'Gentle cleansing', 'Suitable for sensitive skin'],
      howToUse: 'Lather with water and apply to body. Rinse thoroughly.',
      stock: 20,
      status: ProductStatus.ACTIVE,
      categoryId: soapCategory.id,
      collectionIds: [],
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
      images: ['/placeholder.jpg'],
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

  const hairOilId = generateObjectId()
  const hairOil = await prisma.product.upsert({
    where: { id: hairOilId },
    update: {},
    create: {
      id: hairOilId,
      name: 'Hair Growth Oil',
      description: 'Infused with Lavender, Black Seed Oil, and Rosemary Essential Oil.',
      price: 1500,
      discountedPrice: 1350,
      images: ['/placeholder.jpg'],
      weight: '100 ml',
      ingredients: 'Lavender Oil, Black Seed Oil, Rosemary Essential Oil, Coconut Oil, Castor Oil',
      benefits: ['Promotes hair growth', 'Strengthens hair follicles', 'Reduces hair fall'],
      howToUse: 'Apply a small amount to scalp and massage gently. Leave on for at least 30 minutes or overnight for best results.',
      stock: 8,
      status: ProductStatus.ACTIVE,
      categoryId: bodyCareCategory.id,
      collectionIds: [bestSellersCollection.id],
    },
  })

  const serumId = generateObjectId()
  const serum = await prisma.product.upsert({
    where: { id: serumId },
    update: {},
    create: {
      id: serumId,
      name: 'Anti-Aging Face Serum',
      description: 'Luxurious serum with Castor oil, Jojoba oil, and Frankincense Essential Oil.',
      price: 1500,
      images: ['/placeholder.jpg'],
      weight: '30 ml',
      ingredients: 'Castor Oil, Jojoba Oil, Frankincense Essential Oil, Vitamin E',
      benefits: ['Reduces fine lines', 'Hydrates skin', 'Improves skin elasticity'],
      howToUse: 'Apply a few drops to clean face and neck. Gently massage in upward motions until absorbed.',
      stock: 15,
      status: ProductStatus.ACTIVE,
      categoryId: bodyCareCategory.id,
      collectionIds: [premiumCollection.id],
    },
  })

  const dentalPowderId = generateObjectId()
  const dentalPowder = await prisma.product.upsert({
    where: { id: dentalPowderId },
    update: {},
    create: {
      id: dentalPowderId,
      name: 'Dental Powder',
      description: 'Natural dental care with Bentonite Clay, Activated Charcoal, and herbs.',
      price: 700,
      images: ['/placeholder.jpg'],
      weight: '50 gram',
      ingredients: 'Bentonite Clay, Activated Charcoal, Neem Powder, Clove Oil, Peppermint Oil',
      benefits: ['Natural teeth whitening', 'Freshens breath', 'Supports gum health'],
      howToUse: 'Wet toothbrush and dip into powder. Brush teeth as normal and rinse thoroughly.',
      stock: 5,
      status: ProductStatus.ACTIVE,
      categoryId: accessoriesCategory.id,
      collectionIds: [],
    },
  })

  const product8 = await prisma.product.upsert({
    where: { slug: 'rose-water-toner' },
    update: {},
    create: {
      name: 'Rose Water Toner',
      slug: 'rose-water-toner',
      description: 'Pure rose water toner to refresh and hydrate skin.',
      price: 800,
      images: ['/placeholder.jpg'],
      weight: '100 ml',
      ingredients: 'Pure Rose Water, Glycerin, Aloe Vera Extract',
      stock: 50,
      categoryId: bodyWashCategory.id,
      collections: {
        connect: [{ id: bestSellersCollection.id }],
      },
    },
  })

  const product9 = await prisma.product.upsert({
    where: { slug: 'aloe-vera-gel' },
    update: {},
    create: {
      name: 'Aloe Vera Gel',
      slug: 'aloe-vera-gel',
      description: 'Pure aloe vera gel for skin and hair.',
      price: 650,
      images: ['/placeholder.jpg'],
      weight: '100 gram',
      ingredients: 'Aloe Vera Extract, Vitamin E, Glycerin',
      stock: 75,
      categoryId: bodyWashCategory.id,
      collections: {
        connect: [{ id: newArrivalsCollection.id }],
      },
    },
  })

  const product10 = await prisma.product.upsert({
    where: { slug: 'bamboo-soap-dish' },
    update: {},
    create: {
      name: 'Bamboo Soap Dish',
      slug: 'bamboo-soap-dish',
      description: 'Eco-friendly bamboo soap dish to keep your soap dry.',
      price: 350,
      images: ['/placeholder.jpg'],
      weight: '50 gram',
      stock: 100,
      categoryId: accessoriesCategory.id,
      collections: {
        connect: [{ id: bestSellersCollection.id }],
      },
    },
  })

  const product11 = await prisma.product.upsert({
    where: { slug: 'sisal-soap-bag' },
    update: {},
    create: {
      name: 'Sisal Soap Bag',
      slug: 'sisal-soap-bag',
      description: 'Natural sisal soap bag for exfoliation and extending soap life.',
      price: 250,
      images: ['/placeholder.jpg'],
      weight: '20 gram',
      stock: 150,
      categoryId: accessoriesCategory.id,
      collections: {
        connect: [{ id: newArrivalsCollection.id }],
      },
    },
  })

  const product12 = await prisma.product.upsert({
    where: { slug: 'wooden-hair-brush' },
    update: {},
    create: {
      name: 'Wooden Hair Brush',
      slug: 'wooden-hair-brush',
      description: 'Natural wooden hair brush with wooden bristles.',
      price: 1200,
      images: ['/placeholder.jpg'],
      weight: '100 gram',
      stock: 50,
      categoryId: accessoriesCategory.id,
      collections: {
        connect: [{ id: premiumCollection.id }],
      },
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