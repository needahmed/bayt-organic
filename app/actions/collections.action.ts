'use server'

import { prisma } from '@/lib/prisma'
import { uploadImage, deleteImage } from '@/lib/azure-storage'
import { revalidatePath } from 'next/cache'
import { Collection } from '@prisma/client'

// Types for collection operations
export type CollectionFormData = {
  name: string
  slug: string
  description?: string
  image?: File
  existingImage?: string
  productIds?: string[]
}

// Get all collections
export async function getCollections() {
  try {
    const collections = await prisma.collection.findMany({
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
    })
    
    return { success: true, data: collections }
  } catch (error) {
    console.error('Error getting collections:', error)
    return { success: false, error: 'Failed to get collections' }
  }
}

// Get collection by ID
export async function getCollectionById(id: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            category: true
          }
        },
      },
    })
    
    if (!collection) {
      return { success: false, error: 'Collection not found' }
    }
    
    return { success: true, data: collection }
  } catch (error) {
    console.error(`Error getting collection with ID ${id}:`, error)
    return { success: false, error: 'Failed to get collection' }
  }
}

// Get collection by slug
export async function getCollectionBySlug(slug: string) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            category: true,
            collections: true,
          }
        },
      },
    })
    
    if (!collection) {
      return { success: false, error: 'Collection not found' }
    }
    
    return { success: true, data: collection }
  } catch (error) {
    console.error(`Error getting collection with slug ${slug}:`, error)
    return { success: false, error: 'Failed to get collection' }
  }
}

// Create a new collection
export async function createCollection(data: CollectionFormData) {
  try {
    // Upload image to Azure Blob Storage if provided
    let imageUrl: string | undefined = undefined
    
    if (data.image) {
      imageUrl = await uploadImage(data.image)
    }
    
    // Create the collection in the database
    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: imageUrl,
        products: data.productIds && data.productIds.length > 0
          ? {
              connect: data.productIds.map(id => ({ id }))
            }
          : undefined
      },
    })
    
    revalidatePath('/admin/collections')
    revalidatePath('/products')
    
    return { success: true, data: collection }
  } catch (error) {
    console.error('Error creating collection:', error)
    return { success: false, error: 'Failed to create collection' }
  }
}

// Update a collection
export async function updateCollection(id: string, data: CollectionFormData) {
  try {
    // Get the existing collection
    const existingCollection = await prisma.collection.findUnique({
      where: { id },
      select: { image: true }
    })
    
    if (!existingCollection) {
      return { success: false, error: 'Collection not found' }
    }
    
    // Handle image update
    let imageUrl = data.existingImage
    
    // Delete old image if it's being replaced
    if (existingCollection.image && existingCollection.image !== data.existingImage && data.image) {
      await deleteImage(existingCollection.image)
    }
    
    // Upload new image if provided
    if (data.image) {
      imageUrl = await uploadImage(data.image)
    }
    
    // Update the collection
    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: imageUrl,
        products: data.productIds
          ? {
              set: data.productIds.map(id => ({ id }))
            }
          : undefined
      },
    })
    
    revalidatePath('/admin/collections')
    revalidatePath(`/collections/${collection.slug}`)
    revalidatePath('/products')
    
    return { success: true, data: collection }
  } catch (error) {
    console.error(`Error updating collection with ID ${id}:`, error)
    return { success: false, error: 'Failed to update collection' }
  }
}

// Delete a collection
export async function deleteCollection(id: string) {
  try {
    // First, check if any products are linked to this collection
    const productCount = await prisma.product.count({
      where: {
        collectionIds: {
          has: id
        }
      }
    });

    if (productCount > 0) {
      return {
        success: false,
        error: `Cannot delete collection. ${productCount} product(s) are still linked to it.`,
      };
    }

    // If no products are linked, proceed with deletion
    // Get the collection to delete its image
    const collection = await prisma.collection.findUnique({
      where: { id },
      select: { image: true }
    })
    
    if (!collection) {
      return { success: false, error: 'Collection not found' }
    }
    
    // Delete image from Azure Blob Storage if it exists
    if (collection.image) {
      await deleteImage(collection.image)
    }
    
    // Delete the collection from the database
    await prisma.collection.delete({
      where: { id },
    })
    
    revalidatePath('/admin/collections')
    revalidatePath('/products')
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting collection with ID ${id}:`, error)
    return { success: false, error: 'Failed to delete collection' }
  }
} 