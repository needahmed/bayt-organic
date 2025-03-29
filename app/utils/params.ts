'use client'

import React from 'react'

/**
 * Safely extracts the ID from Next.js route params, handling both current and future versions
 * where params might be a Promise that needs to be unwrapped with React.use()
 */
export function useParamId(params: any): string {
  // Direct access (current Next.js)
  if (params && typeof params === 'object' && 'id' in params) {
    return params.id as string;
  }
  
  // Future Next.js where params is a Promise
  try {
    const unwrapped = React.use(params as any);
    return (unwrapped && typeof unwrapped === 'object' && 'id' in unwrapped) 
      ? unwrapped.id as string 
      : '';
  } catch (e) {
    console.error("Error unwrapping params:", e);
    return '';
  }
} 