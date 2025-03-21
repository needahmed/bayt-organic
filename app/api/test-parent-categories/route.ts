import { NextResponse } from 'next/server';
import { getParentCategories } from '@/app/actions/categories.action';

export async function GET() {
  try {
    console.log('Testing getParentCategories function from API route...');
    
    const result = await getParentCategories();
    
    if (result.success && result.data) {
      console.log(`Success! Found ${result.data.length} parent categories`);
      
      return NextResponse.json({
        success: true,
        message: 'Parent categories retrieved successfully',
        data: result.data
      });
    } else {
      console.error('Error:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error || 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error testing getParentCategories:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 