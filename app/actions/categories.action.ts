'use server'

import { prisma } from '@/lib/prisma'
import { uploadImage, deleteImage } from '@/lib/azure-storage'
import { revalidatePath } from 'next/cache'
import { Category } from '@prisma/client'

// Types for category operations
export type CategoryFormData = {
  name: string
  slug: string
  description?: string
  image?: File
  existingImage?: string
  parentId?: string | null
}

// Get all categories
export async function getCategories() {
  try {
    console.log("Fetching all categories...");
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
    
    // After fetching categories, manually establish parent/subcategory relationships
    const categoriesWithRelations = categories.map(category => {
      return {
        ...category,
        parent: categories.find(p => p.id === category.parentId) || null,
        subcategories: categories.filter(c => c.parentId === category.id)
      };
    });
    
    console.log(`Found ${categoriesWithRelations.length} categories`);
    return { success: true, data: categoriesWithRelations };
  } catch (error) {
    console.error('Error getting categories:', error);
    return { success: false, error: 'Failed to get categories' };
  }
}

// Get parent categories only
export async function getParentCategories() {
  try {
    console.log("Fetching parent categories...");
    const categories = await prisma.category.findMany({
      where: {
        // For MongoDB, we need to use isSet: false to find null fields
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
    
    console.log(`Found ${categories.length} parent categories`);
    return { success: true, data: categories };
  } catch (error) {
    console.error('Error getting parent categories:', error);
    return { success: false, error: 'Failed to get parent categories' };
  }
}

// Get subcategories of a parent category
export async function getSubcategories(parentId: string) {
  try {
    const subcategories = await prisma.category.findMany({
      where: {
        parentId
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
    
    console.log(`Found ${subcategories.length} subcategories for parent ${parentId}`);
    return { success: true, data: subcategories };
  } catch (error) {
    console.error(`Error getting subcategories for parent ${parentId}:`, error);
    return { success: false, error: 'Failed to get subcategories' };
  }
}

// Get category by ID
export async function getCategoryById(id: string) {
  try {
    // Fetch the target category
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
        _count: {
          select: {
            products: true
          }
        }
      },
    });
    
    if (!category) {
      return { success: false, error: 'Category not found' };
    }
    
    // Fetch all categories to establish relationships
    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });
    
    // Find the parent category if it exists
    const parent = allCategories.find(c => c.id === category.parentId);
    
    // Find subcategories of this category
    const subcategories = allCategories.filter(c => c.parentId === category.id);
    
    // Ensure all fields exist (backward compatibility)
    const safeCategory = {
      ...category,
      description: category.description || "",
      parentId: category.parentId || "",
      parent: parent || null,
      subcategories: subcategories || []
    };
    
    return { success: true, data: safeCategory };
  } catch (error) {
    console.error(`Error getting category with ID ${id}:`, error);
    return { success: false, error: 'Failed to get category' };
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    // Fetch the target category
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            category: true,
            collections: true,
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      },
    });
    
    if (!category) {
      return { success: false, error: 'Category not found' };
    }
    
    // Fetch all categories to establish relationships
    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });
    
    // Find the parent category if it exists
    const parent = allCategories.find(c => c.id === category.parentId);
    
    // Find subcategories of this category
    const subcategories = allCategories.filter(c => c.parentId === category.id);
    
    // Ensure all fields exist (backward compatibility)
    const safeCategory = {
      ...category,
      description: category.description || "",
      parentId: category.parentId || "",
      parent: parent || null,
      subcategories: subcategories || []
    };
    
    return { success: true, data: safeCategory };
  } catch (error) {
    console.error(`Error getting category with slug ${slug}:`, error);
    return { success: false, error: 'Failed to get category' };
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
        description: data.description,
        image: imageUrl,
        parentId: data.parentId || null,
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
      select: { 
        image: true,
        parentId: true
      }
    })
    
    if (!existingCategory) {
      return { success: false, error: 'Category not found' }
    }
    
    // Ensure we're not setting a category as its own parent or child
    if (data.parentId === id) {
      return { success: false, error: 'A category cannot be its own parent' }
    }
    
    // Check for circular references (parent being a child of this category)
    if (data.parentId) {
      const isCircular = await isCircularReference(id, data.parentId)
      if (isCircular) {
        return { success: false, error: 'This would create a circular reference in the category hierarchy' }
      }
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
        description: data.description,
        image: imageUrl,
        parentId: data.parentId,
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

// Helper to check for circular references in category hierarchy
async function isCircularReference(categoryId: string, potentialParentId: string): Promise<boolean> {
  // If the potential parent is this category, it's circular
  if (categoryId === potentialParentId) {
    return true
  }
  
  // Get all subcategories of this category
  const subcategories = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true }
  })
  
  // Check if the potential parent is a subcategory of this category (at any level)
  for (const sub of subcategories) {
    if (sub.id === potentialParentId || await isCircularReference(sub.id, potentialParentId)) {
      return true
    }
  }
  
  return false
}

// Delete a category
export async function deleteCategory(id: string) {
  try {
    // Get the category to delete its image
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subcategories: true,
        products: {
          select: { id: true }
        }
      }
    })
    
    if (!category) {
      return { success: false, error: 'Category not found' }
    }
    
    // Check if it has subcategories
    if (category.subcategories.length > 0) {
      return { 
        success: false, 
        error: 'Cannot delete category with subcategories. Please delete or reassign the subcategories first.' 
      }
    }
    
    // Check if it has products
    if (category.products.length > 0) {
      return { 
        success: false, 
        error: 'Cannot delete category with products. Please reassign the products first.' 
      }
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

// Migration function to ensure all categories have the new fields
export async function migrateCategories() {
  try {
    // Instead of trying to migrate existing fields, let's just read the categories
    // The schema changes should already be applied by Prisma db push
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories during migration check`);
    
    return { success: true, count: categories.length };
  } catch (error) {
    console.error('Error during category migration check:', error);
    return { success: false, error: 'Failed to check categories' };
  }
} 