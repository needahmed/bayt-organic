// This script initializes the Azure Blob Storage container
// Run it with: node scripts/init-azure.js

require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');

// Container name for product images
const containerName = 'product-images';

async function initializeContainer() {
  try {
    // Initialize the container
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    if (!connectionString) {
      console.error('Azure Storage connection string not found in environment variables');
      process.exit(1);
    }
    
    console.log('Connecting to Azure Blob Storage...');
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // Create the container if it doesn't exist
    console.log(`Checking if container '${containerName}' exists...`);
    const exists = await containerClient.exists();
    
    if (!exists) {
      console.log(`Creating container '${containerName}'...`);
      await containerClient.create({
        access: 'blob' // Public read access for blobs only
      });
      console.log(`Container '${containerName}' created successfully`);
    } else {
      console.log(`Container '${containerName}' already exists`);
    }
    
    console.log('Azure Blob Storage container initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Azure Blob Storage container:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeContainer().catch(console.error); 