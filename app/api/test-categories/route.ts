import { NextResponse } from 'next/server';
import { getCategories } from '@/app/actions/categories.action';

export async function GET() {
  try {
    console.log('Testing getCategories function from API route...');
    
    const result = await getCategories();
    
    if (result.success && result.data) {
      console.log(`Success! Found ${result.data.length} categories`);
      
      // Check that parent and subcategories are properly populated
      const withParents = result.data.filter(cat => cat.parent).length;
      const withSubcategories = result.data.filter(cat => cat.subcategories && cat.subcategories.length > 0).length;
      
      console.log(`Categories with parents: ${withParents}`);
      console.log(`Categories with subcategories: ${withSubcategories}`);
      
      // Show one example of parent-child relationship
      const bodyCare = result.data.find(cat => cat.name === 'Body Care');
      
      return NextResponse.json({
        success: true,
        message: 'Categories retrieved successfully',
        data: {
          total: result.data.length,
          withParents,
          withSubcategories,
          example: bodyCare || null
        }
      });
    } else {
      console.error('Error:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error || 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error testing getCategories:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 