import { NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'

// Container name for product images
const containerName = 'product-images'

// Initialize the Azure Blob Storage container
export async function GET() {
  try {
    // Initialize the container
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
    
    if (!connectionString) {
      console.error('Azure Storage connection string not found in environment variables')
      return NextResponse.json({ 
        success: false, 
        message: 'Azure Storage connection string not found in environment variables' 
      }, { status: 500 })
    }
    
    try {
      console.log('Connecting to Azure Blob Storage...')
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
      const containerClient = blobServiceClient.getContainerClient(containerName)
      
      // Create the container if it doesn't exist
      console.log(`Checking if container '${containerName}' exists...`)
      const exists = await containerClient.exists()
      
      if (!exists) {
        console.log(`Creating container '${containerName}'...`)
        await containerClient.create({
          access: 'blob' // Public read access for blobs only
        })
        console.log(`Container '${containerName}' created successfully`)
      } else {
        console.log(`Container '${containerName}' already exists`)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Azure Blob Storage container initialized successfully' 
      })
    } catch (error) {
      console.error('Error connecting to Azure Blob Storage:', error)
      return NextResponse.json({ 
        success: false, 
        message: 'Error connecting to Azure Blob Storage',
        error: error instanceof Error ? error.message : String(error)
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Failed to initialize Azure Blob Storage container:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to initialize Azure Blob Storage container',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 