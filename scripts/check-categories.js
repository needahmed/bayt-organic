const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const categories = await prisma.category.findMany();
    console.log('All Categories:');
    console.log(JSON.stringify(categories, null, 2));
    
    // Count categories by parent/child status
    const parentCategories = categories.filter(c => !c.parentId);
    const childCategories = categories.filter(c => c.parentId);
    
    console.log(`\nTotal Categories: ${categories.length}`);
    console.log(`Parent Categories: ${parentCategories.length}`);
    console.log(`Child Categories: ${childCategories.length}`);
    
    // Show parent-child relationships
    console.log('\nCategory Hierarchy:');
    for (const parent of parentCategories) {
      console.log(`- ${parent.name} (${parent.id})`);
      
      // Find children of this parent
      const children = categories.filter(c => c.parentId === parent.id);
      for (const child of children) {
        console.log(`  └─ ${child.name} (${child.id})`);
      }
    }
  } catch (error) {
    console.error('Error checking categories:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 