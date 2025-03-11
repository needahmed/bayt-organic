import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob'

const containerName = 'product-images'

export const getBlobClient = (blobName: string): BlockBlobClient => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING as string
  )
  const containerClient = blobServiceClient.getContainerClient(containerName)
  return containerClient.getBlockBlobClient(blobName)
}

export const uploadImage = async (file: File): Promise<string> => {
  try {
    console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    // Generate a unique name for the blob
    const timestamp = new Date().getTime()
    const fileName = `${timestamp}-${file.name.replace(/\s/g, '-')}`
    
    // Get the blob client
    const blockBlobClient = getBlobClient(fileName)
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    console.log('File converted to buffer, size:', buffer.length)
    
    // Upload the file
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: file.type
      }
    })
    
    const imageUrl = blockBlobClient.url
    console.log('Image uploaded successfully, URL:', imageUrl)
    
    // Return the URL of the uploaded image
    return imageUrl
  } catch (error: any) {
    console.error('Error details for upload of', file.name, ':', error)
    
    // Fallback to a local URL if Azure upload fails
    // This should be replaced with proper error handling in production
    console.warn('Using fallback local image URL')
    
    // Instead of using via.placeholder.com (which causes 500 errors),
    // return an empty string so we can handle it in the actions
    throw new Error(`Failed to upload image: ${file.name}. Error: ${error.message || 'Unknown error'}`)
  }
}

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Skip deletion for empty URLs, placeholder images or local images
    if (!imageUrl || 
        imageUrl === '' || 
        imageUrl.startsWith('/') || 
        imageUrl.includes('placeholder') || 
        imageUrl.includes('via.placeholder.com')) {
      console.log('Skipping deletion for placeholder, local, or empty image:', imageUrl)
      return
    }
    
    console.log('Attempting to delete image:', imageUrl)
    
    // Extract the blob name from the URL
    const url = new URL(imageUrl)
    const pathSegments = url.pathname.split('/')
    const blobName = pathSegments[pathSegments.length - 1]
    
    console.log('Parsed blob name:', blobName)
    
    // Get the blob client
    const blockBlobClient = getBlobClient(blobName)
    
    // Delete the blob
    await blockBlobClient.delete()
    console.log('Image deleted successfully:', imageUrl)
  } catch (error) {
    console.error('Error deleting image from Azure Blob Storage:', error)
    // Don't throw the error - just log it and continue
    console.warn('Failed to delete image, but continuing anyway:', imageUrl)
  }
} 