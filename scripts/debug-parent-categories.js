const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Debugging parent categories query...');
    
    // Simple query to find all categories
    const allCategories = await prisma.category.findMany();
    console.log(`Total categories: ${allCategories.length}`);
    
    // Count categories with null parentId
    const nullParentCount = allCategories.filter(c => c.parentId === null).length;
    console.log(`Categories with null parentId: ${nullParentCount}`);
    
    // Try direct query for null parentId
    console.log('\nExecuting query with parentId: null...');
    const parentCategories = await prisma.category.findMany({
      where: {
        parentId: null
      }
    });
    console.log(`Query returned: ${parentCategories.length} categories`);
    console.log('Categories returned:');
    console.log(parentCategories.map(c => c.name));
    
    // Try different approach with isSet
    console.log('\nExecuting query with parentId isSet: false...');
    const parentCategoriesAlt = await prisma.category.findMany({
      where: {
        parentId: {
          isSet: false
        }
      }
    });
    console.log(`Query returned: ${parentCategoriesAlt.length} categories`);
    console.log('Categories returned:');
    console.log(parentCategoriesAlt.map(c => c.name));
    
    // Update query in getParentCategories function
    console.log('\nUPDATE: For MongoDB, the correct query should be:');
    console.log('where: { parentId: { isSet: false } }');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 