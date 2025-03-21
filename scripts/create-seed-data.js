const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed products and collections...');
  
  try {
    // First check if we have any categories
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
      console.error('Error: No categories found. Please run the create-categories.js script first.');
      return;
    }
    
    console.log(`Found ${categories.length} categories, proceeding with seed data creation.`);
    
    // Create a featured collection
    const featuredCollection = await prisma.collection.create({
      data: {
        name: 'Featured Products',
        slug: 'featured',
        description: 'Our featured products for this month',
        image: 'https://via.placeholder.com/500'
      }
    });
    console.log(`Created collection: ${featuredCollection.name}`);
    
    // Create a new arrivals collection
    const newArrivalsCollection = await prisma.collection.create({
      data: {
        name: 'New Arrivals',
        slug: 'new-arrivals',
        description: 'Our newest products',
        image: 'https://via.placeholder.com/500'
      }
    });
    console.log(`Created collection: ${newArrivalsCollection.name}`);
    
    // Create some sample products for each category
    for (const category of categories) {
      // Create 1-2 products per category
      const numProducts = Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < numProducts; i++) {
        const productName = `${category.name} Sample ${i + 1}`;
        const productSlug = productName.toLowerCase().replace(/\s+/g, '-');
        
        const product = await prisma.product.create({
          data: {
            name: productName,
            description: `This is a sample ${category.name.toLowerCase()} product with natural ingredients.`,
            price: Math.floor(Math.random() * 50) + 10, // Random price between 10-60
            images: ['https://via.placeholder.com/500'],
            weight: `${Math.floor(Math.random() * 300) + 100}g`,
            ingredients: 'Natural ingredients, essential oils, plant extracts',
            benefits: ['Moisturizing', 'All-natural', 'Organic'],
            howToUse: 'Apply as needed to affected area.',
            stock: Math.floor(Math.random() * 100) + 10,
            status: 'ACTIVE',
            category: {
              connect: { id: category.id }
            },
            // Add to one or both collections
            collections: {
              connect: i % 2 === 0 
                ? [{ id: featuredCollection.id }, { id: newArrivalsCollection.id }]
                : [{ id: featuredCollection.id }]
            }
          }
        });
        
        console.log(`Created product: ${product.name} in category ${category.name}`);
      }
    }
    
    console.log('Seed data creation completed successfully!');
    
  } catch (error) {
    console.error('Error creating seed data:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 