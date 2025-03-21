const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting category update...');
  
  // Get all existing categories
  const existingCategories = await prisma.category.findMany();
  console.log(`Found ${existingCategories.length} categories to update`);
  
  // Update each category - setting parentId where needed
  // For our example, we'll set up a hierarchy:
  // - Soaps (top level)
  // - Shampoos (top level)
  // - Body Care (top level)
  //   - Body Deodorant (child of Body Care)
  //   - Anti-Aging Face Serum (child of Body Care)
  // - Accessories (top level)

  // First, get the IDs for our categories by name
  const soapsCategory = existingCategories.find(c => c.name === "Soaps");
  const shampoosCategory = existingCategories.find(c => c.name === "Shampoos");
  const bodyCareCategory = existingCategories.find(c => c.name === "Body Care");
  const accessoriesCategory = existingCategories.find(c => c.name === "Accessories");

  // If all categories exist, set up subcategories
  if (bodyCareCategory) {
    // Create subcategories under Body Care
    const bodyDeodorant = await prisma.category.upsert({
      where: { slug: 'body-deodorant' },
      update: { 
        parentId: bodyCareCategory.id,
        description: 'Natural body deodorants'
      },
      create: {
        name: 'Body Deodorant',
        slug: 'body-deodorant',
        description: 'Natural body deodorants',
        parentId: bodyCareCategory.id,
        image: "https://via.placeholder.com/300"
      }
    });
    
    const antiAgingSerum = await prisma.category.upsert({
      where: { slug: 'anti-aging-face-serum' },
      update: { 
        parentId: bodyCareCategory.id,
        description: 'Anti-aging serums for the face'
      },
      create: {
        name: 'Anti-Aging Face Serum',
        slug: 'anti-aging-face-serum',
        description: 'Anti-aging serums for the face',
        parentId: bodyCareCategory.id,
        image: "https://via.placeholder.com/300"
      }
    });
    
    console.log(`Created/updated subcategories: ${bodyDeodorant.name}, ${antiAgingSerum.name}`);
  } else {
    console.log('Body Care category not found, cannot create subcategories');
  }
  
  // Update the main categories with descriptions if they exist
  for (const category of [soapsCategory, shampoosCategory, bodyCareCategory, accessoriesCategory]) {
    if (category) {
      await prisma.category.update({
        where: { id: category.id },
        data: {
          description: `Collection of ${category.name.toLowerCase()}`,
          parentId: null, // Ensure it's a top-level category
        }
      });
      console.log(`Updated category: ${category.name}`);
    }
  }
  
  console.log('Category update completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error updating categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 