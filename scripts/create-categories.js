const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting category creation...');
  
  // Create parent categories first
  const soapsCategory = await prisma.category.create({
    data: {
      name: 'Soaps',
      slug: 'soaps',
      description: 'Collection of soaps',
      image: 'https://via.placeholder.com/300'
    }
  });
  console.log(`Created category: ${soapsCategory.name}`);
  
  const shampoosCategory = await prisma.category.create({
    data: {
      name: 'Shampoos',
      slug: 'shampoos',
      description: 'Collection of shampoos',
      image: 'https://via.placeholder.com/300'
    }
  });
  console.log(`Created category: ${shampoosCategory.name}`);
  
  const bodyCareCategory = await prisma.category.create({
    data: {
      name: 'Body Care',
      slug: 'body-care',
      description: 'Collection of body care products',
      image: 'https://via.placeholder.com/300'
    }
  });
  console.log(`Created category: ${bodyCareCategory.name}`);
  
  const accessoriesCategory = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Collection of accessories',
      image: 'https://via.placeholder.com/300'
    }
  });
  console.log(`Created category: ${accessoriesCategory.name}`);
  
  // Create subcategories under Body Care
  const bodyDeodorant = await prisma.category.create({
    data: {
      name: 'Body Deodorant',
      slug: 'body-deodorant',
      description: 'Natural body deodorants',
      parentId: bodyCareCategory.id,
      image: 'https://via.placeholder.com/300'
    }
  });
  console.log(`Created subcategory: ${bodyDeodorant.name}`);
  
  const antiAgingSerum = await prisma.category.create({
    data: {
      name: 'Anti-Aging Face Serum',
      slug: 'anti-aging-face-serum',
      description: 'Anti-aging serums for the face',
      parentId: bodyCareCategory.id,
      image: 'https://via.placeholder.com/300'
    }
  });
  console.log(`Created subcategory: ${antiAgingSerum.name}`);
  
  console.log('Category creation completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error creating categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 