const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing category actions...');
    
    // Test getCategories (simulating server action)
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    // Manually establish parent/subcategory relationships
    const categoriesWithRelations = categories.map(category => {
      return {
        ...category,
        parent: categories.find(p => p.id === category.parentId) || null,
        subcategories: categories.filter(c => c.parentId === category.id)
      };
    });
    
    console.log('\nAll Categories:');
    console.log(`Found ${categoriesWithRelations.length} categories`);
    
    // Test getParentCategories (simulating server action)
    const parentCategories = await prisma.category.findMany({
      where: {
        parentId: {
          isSet: false
        }
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    console.log('\nParent Categories:');
    console.log(`Found ${parentCategories.length} parent categories`);
    parentCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.id})`);
    });
    
    // Verify that subcategories are working correctly
    for (const parent of parentCategories) {
      const subcategories = await prisma.category.findMany({
        where: {
          parentId: parent.id
        },
        orderBy: {
          name: 'asc',
        },
      });
      
      if (subcategories.length > 0) {
        console.log(`\nSubcategories of ${parent.name}:`);
        subcategories.forEach(sub => {
          console.log(`  └─ ${sub.name} (${sub.id})`);
        });
      }
    }
    
    console.log('\nTesting completed successfully!');
  } catch (error) {
    console.error('Error testing category actions:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 