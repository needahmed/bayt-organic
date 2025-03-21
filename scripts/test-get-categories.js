const { getCategories } = require('../app/actions/categories.action');

async function testGetCategories() {
  try {
    console.log('Testing getCategories function...');
    
    const result = await getCategories();
    
    if (result.success) {
      console.log(`Success! Found ${result.data.length} categories`);
      
      // Check that parent and subcategories are properly populated
      const withParents = result.data.filter(cat => cat.parent).length;
      const withSubcategories = result.data.filter(cat => cat.subcategories && cat.subcategories.length > 0).length;
      
      console.log(`Categories with parents: ${withParents}`);
      console.log(`Categories with subcategories: ${withSubcategories}`);
      
      // Show one example of parent-child relationship
      const bodyCare = result.data.find(cat => cat.name === 'Body Care');
      if (bodyCare) {
        console.log('\nExample of category with subcategories:');
        console.log(`Name: ${bodyCare.name}`);
        console.log(`Subcategories: ${bodyCare.subcategories.map(sub => sub.name).join(', ')}`);
      }
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Error testing getCategories:', error);
  }
}

testGetCategories().catch(console.error); 