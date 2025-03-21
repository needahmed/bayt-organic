const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check products
    const products = await prisma.product.findMany({
      include: {
        category: true,
        collections: true
      }
    });
    console.log(`Found ${products.length} products`);
    
    if (products.length > 0) {
      console.log('Sample product:', JSON.stringify(products[0], null, 2));
    }
    
    // Check collections
    const collections = await prisma.collection.findMany();
    console.log(`\nFound ${collections.length} collections`);
    
    if (collections.length > 0) {
      console.log('Sample collection:', JSON.stringify(collections[0], null, 2));
    }
    
    // Check categories
    const categories = await prisma.category.findMany();
    console.log(`\nFound ${categories.length} categories`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 