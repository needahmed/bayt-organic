import { NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'

// Container name for product images
const containerName = 'product-images'

// Initialize the Azure Blob Storage container
let initialized = false

export async function GET() {
  if (!initialized) {
    try {
      // Initialize the container
      const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
      
      if (!connectionString) {
        return NextResponse.json({ 
          success: false, 
          error: 'Azure Storage connection string not found in environment variables' 
        }, { status: 500 })
      }
      
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
      const containerClient = blobServiceClient.getContainerClient(containerName)
      
      // Create the container if it doesn't exist
      const exists = await containerClient.exists()
      if (!exists) {
        await containerClient.create({
          access: 'blob' // Public read access for blobs only
        })
        console.log(`Container '${containerName}' created successfully`)
      }
      
      initialized = true
      return NextResponse.json({ 
        success: true, 
        message: 'Azure Blob Storage container initialized successfully' 
      })
    } catch (error) {
      console.error('Failed to initialize Azure Blob Storage container:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to initialize Azure Blob Storage container' 
      }, { status: 500 })
    }
  }
  
  return NextResponse.json({ 
    success: true, 
    message: 'Azure Blob Storage container already initialized' 
  })
} 