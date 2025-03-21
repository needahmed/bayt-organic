const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const categories = await prisma.category.findMany();
    console.log('All Categories with parentId info:');
    
    categories.forEach(c => {
      console.log(`${c.name} (${c.id}): parentId = ${c.parentId === null ? 'null' : c.parentId}`);
    });
    
    // Update any parent categories that might have empty string parentId
    const updated = await prisma.$transaction(
      categories
        .filter(c => c.parentId === '')
        .map(c => 
          prisma.category.update({
            where: { id: c.id },
            data: { parentId: null }
          })
        )
    );
    
    if (updated.length > 0) {
      console.log(`\nUpdated ${updated.length} categories with empty string parentId to null`);
    } else {
      console.log('\nNo categories needed updating');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 