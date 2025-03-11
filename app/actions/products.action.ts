'use server'

import { prisma } from '@/lib/prisma'
import { uploadFile, deleteFile } from '@/lib/azure-storage-api'
import { revalidatePath } from 'next/cache'
import { Product, ProductStatus } from '@prisma/client'

// Types for product operations
export type ProductFormData = {
  name: string
  description: string
  price: number | string
  discountedPrice?: number | string
  weight?: string
  ingredients?: string
  benefits: string[] | string
  howToUse?: string
  stock: number | string
  status: ProductStatus
  categoryId: string
  collectionIds?: string[] | string
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
    // Debug the incoming data
    console.log('Creating product with data:', {
      ...data,
      images: data.images ? `${data.images.length} image(s)` : 'no images',
      existingImages: data.existingImages || 'none'
    });
    
    // Validate required fields - only check if data exists, not specific fields
    if (!data) {
      console.error('Missing product data')
      return { success: false, error: 'Missing product data' }
    }

    // Handle FormData conversion for benefits
    let benefits: string[] = []
    if (data.benefits) {
      // If benefits is a string, convert it to an array
      if (typeof data.benefits === 'string') {
        benefits = data.benefits.split(',').map((b: string) => b.trim())
      } else {
        benefits = data.benefits as string[]
      }
    }

    // Handle FormData conversion for collectionIds
    let collectionIds: string[] = []
    if (data.collectionIds) {
      // If collectionIds is a string, convert it to an array
      if (typeof data.collectionIds === 'string') {
        collectionIds = [data.collectionIds]
      } else {
        collectionIds = data.collectionIds
      }
    }

    // Process image URLs passed as existingImages
    let imageUrls: string[] = [];
    if (data.existingImages) {
      console.log('Using provided existingImages as product images:', data.existingImages);
      if (typeof data.existingImages === 'string') {
        // Single URL as string
        imageUrls = [data.existingImages];
      } else {
        // Array of URLs
        imageUrls = data.existingImages;
      }
    }
    
    // Also handle File objects for backward compatibility
    if (data.images && data.images.length > 0) {
      try {
        console.log(`Processing ${data.images.length} image file(s)...`);
        
        // Filter out any non-File objects (this can happen with FormData)
        const validFiles = Array.isArray(data.images) 
          ? data.images.filter(img => img instanceof File && img.size > 0)
          : [];
          
        console.log(`Found ${validFiles.length} valid files to upload`);
        
        for (const image of validFiles) {
          console.log(`Uploading image: ${image.name}, size: ${image.size}, type: ${image.type}`);
          try {
            const buffer = Buffer.from(await image.arrayBuffer());
            console.log(`Buffer created for image: ${image.name}, buffer length: ${buffer.length}`);
            const imageUrl = await uploadFile(buffer, image.name);
            console.log(`Result from uploadFile for ${image.name}: ${imageUrl}`);
            if (imageUrl && imageUrl !== '') {
              imageUrls.push(imageUrl);
            } else {
              console.warn(`uploadFile returned an empty URL for image: ${image.name}`);
            }
          } catch (err) {
            console.error(`Failed to upload image ${image.name}:`, err);
            // Continue with other images even if one fails
          }
        }
        
        console.log(`After uploads, final image list contains ${imageUrls.length} URLs: ${imageUrls.join(', ')}`);
      } catch (error) {
        console.error('Error in image upload process:', error);
        // Continue with product creation even if image uploads fail
      }
    }
    
    // Prepare create data with only defined fields
    const createData: any = {
      name: data.name || 'Untitled Product',
      benefits: benefits,
      category: {
        connect: { id: data.categoryId }
      }
    }
    
    // Only include fields that are defined
    if (data.description) createData.description = data.description
    if (data.price !== undefined) createData.price = Number(data.price)
    if (data.discountedPrice !== undefined && data.discountedPrice !== '') {
      createData.discountedPrice = Number(data.discountedPrice)
    }
    if (data.weight !== undefined) createData.weight = data.weight
    if (data.ingredients !== undefined) createData.ingredients = data.ingredients
    if (data.howToUse !== undefined) createData.howToUse = data.howToUse
    if (data.stock !== undefined) createData.stock = Number(data.stock)
    if (data.status) createData.status = data.status
    
    // Always include images array, even if empty
    // Don't use placeholder images as they're causing 500 errors
    createData.images = imageUrls.filter(url => 
      url && url !== '' && !url.includes('placeholder') && !url.includes('via.placeholder.com')
    );
    console.log('Final image URLs being saved:', createData.images);
    
    // Only include collections if collectionIds is defined and has items
    if (collectionIds.length > 0) {
      createData.collections = {
        connect: collectionIds.map(id => ({ id }))
      }
    }
    
    console.log('Creating product with data:', createData)
    
    // Create the product in the database
    const product = await prisma.product.create({
      data: createData
    })
    
    console.log('Product created successfully:', product)
    
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
    // Debug the incoming data
    console.log('Updating product with data:', {
      ...data,
      images: data.images ? `${data.images.length} image(s)` : 'no images',
      existingImages: data.existingImages || 'none',
      formDataEntries: [...(data as any).entries()].map(([key, value]) => {
        if (key === 'existingImages') {
          return { key, value };
        }
        return { key, type: typeof value };
      })
    });
    
    // Validate required fields - only check if data exists, not specific fields
    if (!data) {
      console.error('Missing product data')
      return { success: false, error: 'Missing product data' }
    }

    // Handle FormData conversion for benefits
    let benefits: string[] = []
    if (data.benefits) {
      // If benefits is a string, convert it to an array
      if (typeof data.benefits === 'string') {
        benefits = data.benefits.split(',').map((b: string) => b.trim())
      } else {
        benefits = data.benefits as string[]
      }
    }

    // Handle FormData conversion for collectionIds
    let collectionIds: string[] = []
    if (data.collectionIds) {
      // If collectionIds is a string, convert it to an array
      if (typeof data.collectionIds === 'string') {
        collectionIds = [data.collectionIds]
      } else {
        collectionIds = data.collectionIds
      }
    }

    // Get the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { images: true, categoryId: true }
    })
    
    if (!existingProduct) {
      return { success: false, error: 'Product not found' }
    }
    
    console.log('Existing product images:', existingProduct.images)
    
    // Initialize imageUrls from data.existingImages if provided (these are from our UI component)
    let imageUrls: string[] = [];
    if (data instanceof FormData) {
      // Try to get images using both possible keys
      let existingImgs = data.getAll('existingImages');
      if (!existingImgs || existingImgs.length === 0) {
        existingImgs = data.getAll('existingImages[]');
      }
      if (existingImgs && existingImgs.length > 0) {
        imageUrls = existingImgs.map(item => String(item));
        console.log('Extracted existingImages from FormData:', imageUrls);
      }
    } else if (data.existingImages) {
      if (typeof data.existingImages === 'string') {
        imageUrls = [data.existingImages];
      } else if (Array.isArray(data.existingImages)) {
        imageUrls = data.existingImages;
      }
      console.log('Using provided existingImages:', imageUrls);
    }
    
    // Fallback: if no existing images provided and no new images provided, use existing product images
    if (imageUrls.length === 0 && existingProduct.images && existingProduct.images.length > 0 && (!data.images || !data.images.length)) {
      console.log('No new existingImages provided; falling back to existing product images');
      imageUrls = existingProduct.images.filter(url => 
        url && url !== '' && !url.includes('placeholder') && !url.includes('via.placeholder.com')
      );
    }
    
    // Delete removed images (comparing against the filtered imageUrls)
    const imagesToDelete = Array.isArray(existingProduct.images) 
      ? existingProduct.images.filter(url => 
          url && 
          url !== '' && 
          !imageUrls.includes(url) && 
          !url.includes('placeholder') && 
          !url.includes('via.placeholder.com')
        )
      : [];
    
    if (imagesToDelete.length > 0) {
      console.log('Deleting images:', imagesToDelete);
      try {
        for (const imageUrl of imagesToDelete) {
          try {
            await deleteFile(imageUrl);
            console.log(`Successfully deleted image: ${imageUrl}`);
          } catch (err) {
            console.error(`Failed to delete image ${imageUrl}:`, err);
            // Continue with other image deletions even if one fails
          }
        }
      } catch (error) {
        console.error('Error in image deletion process:', error);
        // Continue with the update even if image deletion fails
      }
    }
    
    // Handle any new image file uploads
    if (data.images && data.images.length > 0) {
      try {
        console.log(`Processing ${data.images.length} new image file(s)...`);
        
        // Filter out any non-File objects (this can happen with FormData)
        const validFiles = Array.isArray(data.images) 
          ? data.images.filter(img => img instanceof File && img.size > 0)
          : [];
          
        console.log(`Found ${validFiles.length} valid files to upload`);
        
        for (const image of validFiles) {
          console.log(`Uploading new image: ${image.name}, size: ${image.size}, type: ${image.type}`);
          try {
            const buffer = Buffer.from(await image.arrayBuffer());
            console.log(`Buffer created for new image: ${image.name}, buffer length: ${buffer.length}`);
            const imageUrl = await uploadFile(buffer, image.name);
            console.log(`Result from uploadFile for new image ${image.name}: ${imageUrl}`);
            if (imageUrl && imageUrl !== '') {
              imageUrls.push(imageUrl);
            } else {
              console.warn(`uploadFile returned an empty URL for new image: ${image.name}`);
            }
          } catch (err) {
            console.error(`Failed to upload new image ${image.name}:`, err);
            // Continue with other images even if one fails
          }
        }
        
        console.log(`After uploads, final image list contains ${imageUrls.length} URLs: ${imageUrls.join(', ')}`);
      } catch (error) {
        console.error('Error in image upload process:', error);
        // Continue with product update even if image uploads fail
      }
    }
    
    // Prepare update data with only defined fields
    const updateData: any = {
      benefits: benefits
    }
    
    // Always include images array, even if empty
    // Filter out any placeholder images
    updateData.images = imageUrls.filter(url => 
      url && url !== '' && !url.includes('placeholder') && !url.includes('via.placeholder.com')
    );
    console.log('Final image URLs being saved:', updateData.images);
    
    // Only include fields that are defined
    if (data.name) updateData.name = data.name
    if (data.description) updateData.description = data.description
    if (data.price !== undefined) updateData.price = Number(data.price)
    if (data.discountedPrice !== undefined && data.discountedPrice !== '') {
      updateData.discountedPrice = Number(data.discountedPrice)
    }
    if (data.weight !== undefined) updateData.weight = data.weight
    if (data.ingredients !== undefined) updateData.ingredients = data.ingredients
    if (data.howToUse !== undefined) updateData.howToUse = data.howToUse
    if (data.stock !== undefined) updateData.stock = Number(data.stock)
    if (data.status) updateData.status = data.status
    
    // Only include category if categoryId is defined
    if (data.categoryId) {
      updateData.category = {
        connect: { id: data.categoryId }
      }
    }
    
    // Only include collections if collectionIds is defined and has items
    if (collectionIds.length > 0) {
      updateData.collections = {
        set: collectionIds.map(id => ({ id }))
      }
    }
    
    console.log('Updating product with data:', updateData)
    
    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    })
    
    console.log('Product updated successfully:', product)
    
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
    try {
      for (const imageUrl of product.images) {
        await deleteFile(imageUrl)
      }
    } catch (error) {
      console.error('Error deleting one or more product images:', error)
      // Continue with product deletion even if image deletion fails
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