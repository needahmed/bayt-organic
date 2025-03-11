'use server'

import { prisma } from '@/lib/prisma'

/**
 * Ensures that a "Featured" collection exists in the database.
 * This is used to display featured products on the home page.
 */
export async function ensureFeaturedCollection() {
  try {
    // Check if the Featured collection already exists
    const existingCollection = await prisma.collection.findUnique({
      where: { slug: 'featured' },
    })

    if (!existingCollection) {
      // Create the Featured collection if it doesn't exist
      await prisma.collection.create({
        data: {
          name: 'Featured',
          slug: 'featured',
          description: 'Products featured on the home page',
        },
      })
      console.log('Created Featured collection')
      return { success: true, message: 'Featured collection created' }
    }

    return { success: true, message: 'Featured collection already exists' }
  } catch (error) {
    console.error('Error ensuring Featured collection:', error)
    return { success: false, error: 'Failed to ensure Featured collection exists' }
  }
} 