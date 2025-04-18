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
  images?: File[] | null
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
    let imageUrls: string[] = [];
    
    // 1. Handle new file uploads if data.images is provided
    if (data.images && data.images.length > 0) {
      console.log(`Processing ${data.images.length} new image file(s)...`);
      const validFiles = Array.isArray(data.images) 
        ? data.images.filter(img => img instanceof File && img.size > 0)
        : [];
        
      console.log(`Found ${validFiles.length} valid files to upload`);
      
      for (const file of validFiles) {
        try {
          // Convert File to Buffer
          const buffer = Buffer.from(await file.arrayBuffer());
          // Pass Buffer and filename to uploadFile
          const url = await uploadFile(buffer, file.name); 
          imageUrls.push(url);
          console.log(`Successfully uploaded image: ${url}`);
        } catch (err) {
          console.error('Error uploading file:', err);
          // Decide if one failed upload should stop the whole process
          // return { success: false, error: 'Failed to upload one or more images' };
          // Or continue and log:
          console.warn('Continuing product creation despite image upload failure.')
        }
      }
    }
    
    // 2. Include pre-uploaded image URLs passed via existingImages
    //    (Relevant for scenarios like the AddProductPage where ImageUpload uploads immediately)
    if (data.existingImages && Array.isArray(data.existingImages)) {
       // Filter out any empty strings or potential non-strings if necessary
      const validExistingUrls = data.existingImages.filter(url => typeof url === 'string' && url.trim() !== '');
      imageUrls = [...imageUrls, ...validExistingUrls];
    }
    
    // Remove duplicates just in case
    imageUrls = [...new Set(imageUrls)];

    // Prepare data for Prisma
    const createData: any = {
      name: data.name,
      description: data.description,
      category: { connect: { id: data.categoryId } },
      // Ensure numeric fields are numbers
      price: Number(data.price),
      discountedPrice: (data.discountedPrice !== undefined && data.discountedPrice !== '') ? Number(data.discountedPrice) : undefined,
      weight: data.weight,
      ingredients: data.ingredients,
      // Ensure benefits is an array of strings
      benefits: Array.isArray(data.benefits) ? data.benefits : (typeof data.benefits === 'string' ? data.benefits.split(',').map(s => s.trim()).filter(Boolean) : []),
      howToUse: data.howToUse,
      stock: Number(data.stock),
      // Use ACTIVE as a valid default status
      status: (data.status.toUpperCase() as ProductStatus) || ProductStatus.ACTIVE,
      images: imageUrls, // Use the combined list of URLs
    };
    
    // Handle collections connection
    const collectionIds = Array.isArray(data.collectionIds) 
      ? data.collectionIds 
      : (typeof data.collectionIds === 'string' ? [data.collectionIds] : []);
      
    if (collectionIds.length > 0) {
      createData.collections = {
        connect: collectionIds.map(id => ({ id }))
      }
    }

    // Log before creating
    console.log('Creating product with final data:', JSON.stringify(createData, null, 2))

    // Create the product in the database
    const product = await prisma.product.create({
      data: createData,
    });

    console.log('Product created successfully:', product)
    
    // Revalidate paths
    revalidatePath('/admin/products');
    revalidatePath('/products');
    // Consider revalidating category/collection pages if needed

    return { success: true, data: product };
  } catch (error) {
    console.error('Error creating product:', error)
    // Provide more specific error feedback if possible
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
       return { success: false, error: 'A product with this name/slug might already exist.' };
    }
    return { success: false, error: 'Failed to create product. Check server logs for details.' };
  }
}

// Update a product
export async function updateProduct(id: string, data: ProductFormData) {
  try {
    // Debug the incoming data 
    console.log('⭐ Starting product update for ID:', id);
    console.log('Incoming data type:', data instanceof FormData ? 'FormData' : typeof data);
    
    // Validate required fields - only check if data exists
    if (!data) {
      console.error('Missing product data')
      return { success: false, error: 'Missing product data' }
    }

    // Convert FormData to a standard object if needed
    const formDataObj: Record<string, any> = {};
    if (data instanceof FormData) {
      console.log('Converting FormData to object...');
      for (const [key, value] of data.entries()) {
        // Handle array fields like existingImages[] correctly
        if (key.endsWith('[]')) {
          const baseKey = key.slice(0, -2);
          if (!formDataObj[baseKey]) formDataObj[baseKey] = [];
          formDataObj[baseKey].push(value);
        } else {
          // For fields that might be arrays but don't use [] notation
          if (key === 'existingImages' || key === 'collectionIds') {
            if (!formDataObj[key]) formDataObj[key] = [];
            formDataObj[key].push(value);
          } else {
            formDataObj[key] = value;
          }
        }
      }
      console.log('Converted form data:', JSON.stringify(formDataObj, null, 2));
      
      // Use the processed object instead of the original FormData
      data = { ...formDataObj } as any;
    }

    // Process benefits
    let benefits: string[] = [];
    if (data.benefits) {
      // If benefits is a string, convert it to an array
      if (typeof data.benefits === 'string') {
        benefits = data.benefits.split(',').map((b: string) => b.trim()).filter(Boolean);
      } else {
        benefits = Array.isArray(data.benefits) ? data.benefits : [data.benefits as string];
      }
    }
    console.log('Processed benefits:', benefits);

    // Process collection IDs
    let collectionIds: string[] = [];
    if (data.collectionIds) {
      if (typeof data.collectionIds === 'string') {
        collectionIds = [data.collectionIds];
      } else if (Array.isArray(data.collectionIds)) {
        collectionIds = data.collectionIds;
      }
    }
    console.log('Processed collectionIds:', collectionIds);

    // Get the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { images: true, categoryId: true, collections: true }
    });
    
    if (!existingProduct) {
      return { success: false, error: 'Product not found' };
    }
    
    console.log('Found existing product. Current collections:', 
      existingProduct.collections ? existingProduct.collections.length : 0);
    
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
    
    // Prepare update data
    const updateData: any = {
      // Always include these fields for consistency
      name: data.name,
      description: data.description,
      price: Number(data.price || 0),
      benefits: benefits,
      // Always update images array
      images: imageUrls.filter(url => 
        url && url !== '' && !url.includes('placeholder') && !url.includes('via.placeholder.com')
      )
    };
    
    // Include optional fields if provided
    if (data.discountedPrice !== undefined && data.discountedPrice !== '') {
      updateData.discountedPrice = Number(data.discountedPrice);
    }
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.ingredients !== undefined) updateData.ingredients = data.ingredients;
    if (data.howToUse !== undefined) updateData.howToUse = data.howToUse;
    if (data.stock !== undefined) updateData.stock = Number(data.stock || 0);
    if (data.status) {
      updateData.status = (data.status.toUpperCase() as ProductStatus) || ProductStatus.ACTIVE;
    }
    
    // Update category connection
    if (data.categoryId) {
      updateData.category = {
        connect: { id: data.categoryId }
      };
    }
    
    // Always handle collections
    updateData.collections = {
      set: collectionIds.length > 0 
        ? collectionIds.map(id => ({ id }))
        : [] // Empty array to clear all collections if none provided
    };
    
    console.log('⭐ Updating product with data:', JSON.stringify(updateData, null, 2));
    
    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        collections: true
      }
    });
    
    console.log('⭐ Product updated successfully. New collections:', 
      product.collections ? product.collections.length : 0);
    
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
    // First check if the product is in any carts
    const cartItemCount = await prisma.cartItem.count({
      where: { productId: id },
    })

    if (cartItemCount > 0) {
      console.log(`Cannot delete product ${id}. Found in ${cartItemCount} cart(s).`)
      return {
        success: false,
        error: `Cannot delete product. It is in ${cartItemCount} active cart(s).`,
      }
    }

    // Then check if the product is part of any order items
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    })

    if (orderItemsCount > 0) {
      console.log(`Cannot delete product ${id}. Found in ${orderItemsCount} order(s).`)
      return {
        success: false,
        error: `Cannot delete product. It is part of ${orderItemsCount} existing order(s).`,
      }
    }

    // If no order items or cart items, proceed with deletion
    // Get the product to delete its images
    const product = await prisma.product.findUnique({
      where: { id },
      select: { 
        images: true,
        name: true
      },
    })

    if (!product) {
      console.log(`Product not found with ID ${id}`)
      return { success: false, error: "Product not found" }
    }

    console.log(`Deleting product "${product.name}" (${id})`)
    
    // Delete images from Azure Blob Storage
    try {
      for (const imageUrl of product.images) {
        try {
          await deleteFile(imageUrl)
          console.log(`Successfully deleted image: ${imageUrl}`)
        } catch (err) {
          console.error(`Failed to delete image ${imageUrl}:`, err)
          // Continue with other image deletions even if one fails
        }
      }
    } catch (error) {
      console.error('Error deleting one or more product images:', error)
      // Continue with product deletion even if image deletion fails
    }
    
    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    })
    
    console.log(`Successfully deleted product ${id}`)
    
    revalidatePath('/admin/products')
    revalidatePath('/products')
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error)
    // Provide more specific error message if possible
    let errorMessage = 'Failed to delete product'
    
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage
    }
    
    return { success: false, error: errorMessage }
  }
} 