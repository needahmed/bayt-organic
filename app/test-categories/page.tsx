'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/app/actions/categories.action';

type CategoryWithRelations = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId: string | null;
  parent?: CategoryWithRelations | null;
  subcategories?: CategoryWithRelations[];
  _count?: {
    products: number;
  };
};

export default function TestCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching categories...');
        
        const result = await getCategories();
        console.log('Categories fetch result:', result);
        
        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setError(result.error || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Categories Test Page</h1>
      
      <Link href="/" className="text-blue-500 hover:underline mb-8 block">
        Back to Home
      </Link>
      
      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">All Categories ({categories.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div key={category.id} className="border rounded p-4 shadow">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                  <p className="text-sm text-gray-500">ID: {category.id}</p>
                  <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                  <p className="text-sm text-gray-500">
                    Parent: {category.parent ? category.parent.name : 'None'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Products: {category._count?.products || 0}
                  </p>
                  
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium">Subcategories:</p>
                      <ul className="list-disc pl-5 text-sm">
                        {category.subcategories.map(sub => (
                          <li key={sub.id}>{sub.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Link 
                    href={`/products/${category.slug}`} 
                    className="mt-4 inline-block text-blue-500 hover:text-blue-700"
                  >
                    View Products
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Parent Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories
                .filter(cat => !cat.parentId)
                .map(category => (
                  <div key={category.id} className="border rounded p-4 shadow bg-green-50">
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-500">ID: {category.id}</p>
                    
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium">Subcategories:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {category.subcategories.map(sub => (
                            <li key={sub.id}>{sub.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 