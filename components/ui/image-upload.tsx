'use client';

import React, { useState } from 'react';
import { PlusCircle, X } from "lucide-react";
import Image from 'next/image';
import { Button } from './button';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  images = [],
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setUploadError(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedImages = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Upload response error:', errorData);
            throw new Error(errorData.error || 'Failed to upload image');
          }

          const data = await response.json();
          if (!data.url) {
            throw new Error('Invalid response from server');
          }
          uploadedImages.push(data.url);
        } catch (uploadError) {
          console.error(`Error uploading file ${i}:`, uploadError);
          throw uploadError; // Re-throw to be caught by the outer catch
        }
      }

      onChange(uploadedImages);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square border border-gray-200 rounded-md overflow-hidden group"
          >
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <div className="flex flex-col items-center justify-center p-4">
              <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Upload Image</span>
              <span className="text-xs text-muted-foreground mt-1">
                {images.length} / {maxImages}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
              multiple={maxImages - images.length > 1}
            />
          </label>
        )}
      </div>

      {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

      {images.length === 0 && (
        <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md mb-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-muted-foreground">
              <PlusCircle className="h-full w-full" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">No images uploaded yet</p>
            <div className="mt-4">
              <label className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isUploading}
                >
                  <PlusCircle className="h-4 w-4" />
                  Upload Images
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={isUploading}
                  multiple={maxImages > 1}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 