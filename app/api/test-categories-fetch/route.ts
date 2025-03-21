import { NextResponse } from 'next/server';
import { getCategories } from '@/app/actions/categories.action';

export async function GET() {
  try {
    // Log that we're starting the test
    console.log('🔍 Testing getCategories function with verbose logging...');
    
    // Call the getCategories function
    const result = await getCategories();
    
    if (result.success && result.data) {
      // Log success and category count
      console.log(`✅ Success! Found ${result.data.length} categories`);
      
      // Extract the full category data, preserving all relationships
      const categoriesWithRelations = result.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parentId: cat.parentId,
        description: cat.description,
        image: cat.image,
        hasParent: !!cat.parent,
        subcategoriesCount: cat.subcategories?.length || 0,
        // Return subcategories directly from the original data
        subcategories: cat.subcategories?.map(sub => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          parentId: sub.parentId
        })) || []
      }));
      
      // Return success response with data
      return NextResponse.json({
        success: true,
        message: 'Categories retrieved successfully',
        count: result.data.length,
        categories: categoriesWithRelations
      });
    } else {
      // Log error from result
      console.error('❌ Error from getCategories:', result.error);
      
      // Return error response
      return NextResponse.json({
        success: false,
        error: result.error || 'Unknown error fetching categories'
      }, { status: 500 });
    }
  } catch (error) {
    // Log any unexpected errors
    console.error('❌ Unexpected error in test-categories-fetch endpoint:', error);
    
    // Return error response
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 