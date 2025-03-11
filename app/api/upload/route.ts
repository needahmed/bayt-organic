import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadFile } from '@/lib/azure-storage-api';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Empty file content' },
        { status: 400 }
      );
    }
    
    const buffer = Buffer.from(arrayBuffer);
    console.log(`Processing file: ${file.name}, size: ${buffer.length} bytes, type: ${file.type}`);

    try {
      // Upload to Azure Blob Storage
      const imageUrl = await uploadFile(buffer, file.name);
      console.log(`File uploaded successfully: ${imageUrl}`);
      
      return NextResponse.json({ url: imageUrl });
    } catch (uploadError: any) {
      console.error('Azure upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Error uploading to Azure' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error processing upload request:', error);
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 