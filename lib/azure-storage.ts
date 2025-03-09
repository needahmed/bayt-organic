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
    // Generate a unique name for the blob
    const timestamp = new Date().getTime()
    const fileName = `${timestamp}-${file.name.replace(/\s/g, '-')}`
    
    // Get the blob client
    const blockBlobClient = getBlobClient(fileName)
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload the file
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: file.type
      }
    })
    
    // Return the URL of the uploaded image
    return blockBlobClient.url
  } catch (error) {
    console.error('Error uploading image to Azure Blob Storage:', error)
    throw new Error('Failed to upload image')
  }
}

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the blob name from the URL
    const url = new URL(imageUrl)
    const pathSegments = url.pathname.split('/')
    const blobName = pathSegments[pathSegments.length - 1]
    
    // Get the blob client
    const blockBlobClient = getBlobClient(blobName)
    
    // Delete the blob
    await blockBlobClient.delete()
  } catch (error) {
    console.error('Error deleting image from Azure Blob Storage:', error)
    throw new Error('Failed to delete image')
  }
} 