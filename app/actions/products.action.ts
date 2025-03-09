'use server'

import { prisma } from '@/lib/prisma'
import { uploadImage, deleteImage } from '@/lib/azure-storage'
import { revalidatePath } from 'next/cache'
import { Product, ProductStatus } from '@prisma/client'

// Types for product operations
export type ProductFormData = {
  name: string
  description: string
  price: number
  discountedPrice?: number
  weight?: string
  ingredients?: string
  benefits: string[]
  howToUse?: string
  stock: number
  status: ProductStatus
  categoryId: string
  collectionIds: string[]
  images: File[]
  existingImages?: string[]
}

// Get all products
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        collections: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return { success: true, data: products }
  } catch (error) {
    console.error('Error getting products:', error)
    return { success: false, error: 'Failed to get products' }
  }
}

// Get product by ID
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        collections: true,
        reviews: true,
      },
    })
    
    if (!product) {
      return { success: false, error: 'Product not found' }
    }
    
    return { success: true, data: product }
  } catch (error) {
    console.error(`Error getting product with ID ${id}:`, error)
    return { success: false, error: 'Failed to get product' }
  }
}

// Create a new product
export async function createProduct(data: ProductFormData) {
  try {
    // Upload images to Azure Blob Storage
    const imageUrls: string[] = []
    
    if (data.images && data.images.length > 0) {
      for (const image of data.images) {
        const imageUrl = await uploadImage(image)
        imageUrls.push(imageUrl)
      }
    }
    
    // Create the product in the database
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discountedPrice: data.discountedPrice,
        weight: data.weight,
        ingredients: data.ingredients,
        benefits: data.benefits,
        howToUse: data.howToUse,
        stock: data.stock,
        status: data.status,
        images: imageUrls,
        category: {
          connect: { id: data.categoryId }
        },
        collections: {
          connect: data.collectionIds.map(id => ({ id }))
        }
      },
    })
    
    revalidatePath('/admin/products')
    revalidatePath('/products')
    
    return { success: true, data: product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

// Update a product
export async function updateProduct(id: string, data: ProductFormData) {
  try {
    // Get the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { images: true, categoryId: true }
    })
    
    if (!existingProduct) {
      return { success: false, error: 'Product not found' }
    }
    
    // Handle image updates
    let imageUrls: string[] = data.existingImages || []
    
    // Delete removed images
    const imagesToDelete = existingProduct.images.filter(
      url => !data.existingImages?.includes(url)
    )
    
    for (const imageUrl of imagesToDelete) {
      await deleteImage(imageUrl)
    }
    
    // Upload new images
    if (data.images && data.images.length > 0) {
      for (const image of data.images) {
        const imageUrl = await uploadImage(image)
        imageUrls.push(imageUrl)
      }
    }
    
    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discountedPrice: data.discountedPrice,
        weight: data.weight,
        ingredients: data.ingredients,
        benefits: data.benefits,
        howToUse: data.howToUse,
        stock: data.stock,
        status: data.status,
        images: imageUrls,
        category: {
          connect: { id: data.categoryId }
        },
        collections: {
          set: data.collectionIds.map(id => ({ id }))
        }
      },
      include: {
        category: true
      }
    })
    
    revalidatePath('/admin/products')
    revalidatePath(`/products/${product.category.slug}/${product.id}`)
    revalidatePath('/products')
    
    return { success: true, data: product }
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error)
    return { success: false, error: 'Failed to update product' }
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    // Get the product to delete its images
    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: true }
    })
    
    if (!product) {
      return { success: false, error: 'Product not found' }
    }
    
    // Delete images from Azure Blob Storage
    for (const imageUrl of product.images) {
      await deleteImage(imageUrl)
    }
    
    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    })
    
    revalidatePath('/admin/products')
    revalidatePath('/products')
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error)
    return { success: false, error: 'Failed to delete product' }
  }
} 