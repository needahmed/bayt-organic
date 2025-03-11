import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

// Connection string for Azure Storage
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const containerName = 'product-images';

if (!connectionString) {
  console.warn('Azure Storage connection string not found, uploads will fail');
}

// Create the BlobServiceClient object
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Get a reference to a container
const containerClient = blobServiceClient.getContainerClient(containerName);

// Create the container if it doesn't exist
export async function ensureContainerExists() {
  try {
    await containerClient.createIfNotExists({
      access: 'blob',
    });
    console.log(`Container '${containerName}' created or already exists`);
  } catch (error: any) {
    console.error(`Error creating container: ${error.message}`);
    throw error;
  }
}

// Upload a file to Azure Blob Storage
export async function uploadFile(file: Buffer, fileName: string): Promise<string> {
  try {
    if (!connectionString) {
      throw new Error('Azure Storage connection string not found');
    }

    if (!file || file.length === 0) {
      throw new Error('Empty file provided');
    }

    // Ensure the container exists
    await ensureContainerExists();

    // Create a unique name for the blob
    const timestamp = new Date().getTime();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const blobName = `${timestamp}-${sanitizedFileName}`;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log(`Uploading file "${sanitizedFileName}" (${file.length} bytes) to Azure Blob Storage...`);

    // Upload data to the blob
    const uploadResponse = await blockBlobClient.upload(file, file.length);
    
    if (!uploadResponse.errorCode) {
      console.log(`File uploaded successfully. ETag: ${uploadResponse.etag}`);
      // Return the URL of the uploaded blob
      return blockBlobClient.url;
    } else {
      throw new Error(`Upload failed with error code: ${uploadResponse.errorCode}`);
    }
  } catch (error: any) {
    console.error(`Error uploading file: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to Azure Storage. Please check your connection.');
    } else if (error.statusCode) {
      throw new Error(`Azure Storage error (${error.statusCode}): ${error.message}`);
    }
    throw error;
  }
}

// Delete a file from Azure Blob Storage
export async function deleteFile(blobUrl: string): Promise<void> {
  try {
    // Skip deletion for empty URLs, placeholder images or local images
    if (!blobUrl || 
        blobUrl === '' || 
        blobUrl.startsWith('/') || 
        blobUrl.includes('placeholder') || 
        blobUrl.includes('via.placeholder.com')) {
      console.log('Skipping deletion for placeholder, local, or empty image:', blobUrl);
      return;
    }

    // Extract the blob name from the URL
    const url = new URL(blobUrl);
    const pathSegments = url.pathname.split('/');
    const blobName = pathSegments[pathSegments.length - 1];

    console.log('Attempting to delete blob:', blobName);
    
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Delete the blob
    await blockBlobClient.delete();
    console.log(`Blob '${blobName}' deleted successfully`);
  } catch (error: any) {
    console.error(`Error deleting file: ${error.message}`);
    // Don't throw the error - just log it and continue
    console.warn('Failed to delete image, but continuing anyway:', blobUrl);
  }
}

// List all blobs in the container
export async function listFiles(): Promise<string[]> {
  try {
    const blobs: string[] = [];
    
    // List all blobs in the container
    for await (const blob of containerClient.listBlobsFlat()) {
      const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
      blobs.push(blockBlobClient.url);
    }
    
    return blobs;
  } catch (error: any) {
    console.error(`Error listing files: ${error.message}`);
    throw error;
  }
} 