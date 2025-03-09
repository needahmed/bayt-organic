'use server'

import { prisma } from '@/lib/prisma'
import { uploadImage, deleteImage } from '@/lib/azure-storage'
import { revalidatePath } from 'next/cache'
import { Category } from '@prisma/client'

// Types for category operations
export type CategoryFormData = {
  name: string
  slug: string
  image?: File
  existingImage?: string
}

// Get all categories
export async function getCategories() {
  try {
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
    })
    
    return { success: true, data: categories }
  } catch (error) {
    console.error('Error getting categories:', error)
    return { success: false, error: 'Failed to get categories' }
  }
}

// Get category by ID
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    })
    
    if (!category) {
      return { success: false, error: 'Category not found' }
    }
    
    return { success: true, data: category }
  } catch (error) {
    console.error(`Error getting category with ID ${id}:`, error)
    return { success: false, error: 'Failed to get category' }
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
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
    
    if (!category) {
      return { success: false, error: 'Category not found' }
    }
    
    return { success: true, data: category }
  } catch (error) {
    console.error(`Error getting category with slug ${slug}:`, error)
    return { success: false, error: 'Failed to get category' }
  }
}

// Create a new category
export async function createCategory(data: CategoryFormData) {
  try {
    // Upload image to Azure Blob Storage if provided
    let imageUrl: string | undefined = undefined
    
    if (data.image) {
      imageUrl = await uploadImage(data.image)
    }
    
    // Create the category in the database
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        image: imageUrl,
      },
    })
    
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    
    return { success: true, data: category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

// Update a category
export async function updateCategory(id: string, data: CategoryFormData) {
  try {
    // Get the existing category
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      select: { image: true }
    })
    
    if (!existingCategory) {
      return { success: false, error: 'Category not found' }
    }
    
    // Handle image update
    let imageUrl = data.existingImage
    
    // Delete old image if it's being replaced
    if (existingCategory.image && existingCategory.image !== data.existingImage && data.image) {
      await deleteImage(existingCategory.image)
    }
    
    // Upload new image if provided
    if (data.image) {
      imageUrl = await uploadImage(data.image)
    }
    
    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        image: imageUrl,
      },
    })
    
    revalidatePath('/admin/categories')
    revalidatePath(`/products/${category.slug}`)
    revalidatePath('/products')
    
    return { success: true, data: category }
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error)
    return { success: false, error: 'Failed to update category' }
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  try {
    // Get the category to delete its image
    const category = await prisma.category.findUnique({
      where: { id },
      select: { image: true }
    })
    
    if (!category) {
      return { success: false, error: 'Category not found' }
    }
    
    // Delete image from Azure Blob Storage if it exists
    if (category.image) {
      await deleteImage(category.image)
    }
    
    // Delete the category from the database
    await prisma.category.delete({
      where: { id },
    })
    
    revalidatePath('/admin/categories')
    revalidatePath('/products')
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error)
    return { success: false, error: 'Failed to delete category' }
  }
} 