'use client'

import React from 'react'

/**
 * Safely extracts the ID from Next.js route params, handling both current and future versions
 * where params might be a Promise that needs to be unwrapped with React.use()
 */
export function useParamId(params: any): string {
  // Use React.use to unwrap params if it's a Promise
  const unwrappedParams = params && typeof params === 'object' && 'then' in params 
    ? React.use(params)
    : params;
    
  // Extract ID from unwrapped params
  if (unwrappedParams && typeof unwrappedParams === 'object' && 'id' in unwrappedParams) {
    return unwrappedParams.id as string;
  }
  
  console.error("Could not extract ID from params", unwrappedParams);
  return '';
} 