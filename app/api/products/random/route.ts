import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get a random product from the database
    const productsCount = await prisma.product.count({
      where: {
        status: 'ACTIVE',
        stock: { gt: 0 }
      }
    });
    
    if (productsCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No active products found' 
      });
    }
    
    // Get a random active product
    const skip = Math.floor(Math.random() * productsCount);
    const product = await prisma.product.findFirst({
      where: {
        status: 'ACTIVE',
        stock: { gt: 0 }
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true
      },
      skip: skip
    });
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'No product found' 
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error('Error fetching random product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch random product' 
    }, { status: 500 });
  }
} 