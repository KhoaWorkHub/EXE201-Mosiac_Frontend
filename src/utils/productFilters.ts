// src/utils/productFilters.ts
import type { ProductResponse } from '@/types/product.types';

/**
 * Check if a product has black color variant
 */
export const hasBlackVariant = (product: ProductResponse): boolean => {
  if (!product.variants || product.variants.length === 0) {
    return false;
  }
  
  return product.variants.some(variant => 
    variant.active && (
      variant.color === 'Đen' || 
      variant.color.toLowerCase() === 'đen' ||
      variant.color.toLowerCase() === 'black'
    )
  );
};

/**
 * Get black variant from product
 */
export const getBlackVariant = (product: ProductResponse) => {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }
  
  return product.variants.find(variant => 
    variant.active && (
      variant.color === 'Đen' || 
      variant.color.toLowerCase() === 'đen' ||
      variant.color.toLowerCase() === 'black'
    )
  );
};

/**
 * Filter products to only show those with black variants
 */
export const filterProductsWithBlackVariants = (products: ProductResponse[]): ProductResponse[] => {
  return products.filter(hasBlackVariant);
};

/**
 * Get the black variant image of a product based on variant color
 */
export const getProductBlackImage = (product: ProductResponse): string => {
  if (!product.images || product.images.length === 0) {
    return '/placeholder-product.jpg';
  }
  
  // First check if product has black variant
  const blackVariant = getBlackVariant(product);
  if (!blackVariant) {
    // If no black variant, return primary image as fallback
    return getProductPrimaryImage(product);
  }
  
  // Try to find black color image based on altText patterns
  // This helps match images to the black variant
  const blackImage = product.images.find(img => 
    img.altText && (
      img.altText.toLowerCase().includes('black') ||
      img.altText.toLowerCase().includes('đen') ||
      // Check for specific patterns like "khblack", "saigonblack", etc.
      /\w+black/i.test(img.altText) ||
      // Check for back images which are usually black in this dataset
      (img.altText.toLowerCase().includes('back') && !img.altText.toLowerCase().includes('white'))
    )
  );
  
  if (blackImage) {
    return blackImage.imageUrl;
  }
  
  // Fallback: Try to find primary image that's not explicitly white
  const primaryImage = product.images.find(img => 
    img.isPrimary && 
    (!img.altText || (
      !img.altText.toLowerCase().includes('white') && 
      !img.altText.toLowerCase().includes('trắng') &&
      !img.altText.toLowerCase().includes('whiotefront')
    ))
  );
  
  if (primaryImage) {
    return primaryImage.imageUrl;
  }
  
  // Final fallback: get the first image
  const sortedImages = [...product.images].sort((a, b) => a.displayOrder - b.displayOrder);
  return sortedImages[0]?.imageUrl || '/placeholder-product.jpg';
};

/**
 * Get the first/primary image of a product (original function for backward compatibility)
 */
export const getProductPrimaryImage = (product: ProductResponse): string => {
  if (!product.images || product.images.length === 0) {
    return '/placeholder-product.jpg';
  }
  
  // Try to find primary image first
  const primaryImage = product.images.find(img => img.isPrimary);
  if (primaryImage) {
    return primaryImage.imageUrl;
  }
  
  // If no primary image, get the first one
  const sortedImages = [...product.images].sort((a, b) => a.displayOrder - b.displayOrder);
  return sortedImages[0]?.imageUrl || '/placeholder-product.jpg';
};

/**
 * Create a modified product object that only shows black variant info and appropriate price
 */
export const createBlackVariantProduct = (product: ProductResponse): ProductResponse => {
  const blackVariant = getBlackVariant(product);
  
  if (!blackVariant) {
    return product;
  }
  
  // Calculate price with black variant adjustment
  const blackVariantPrice = product.price + blackVariant.priceAdjustment;
  
  return {
    ...product,
    price: blackVariantPrice,
    stockQuantity: blackVariant.stockQuantity,
    variants: [blackVariant], // Only show black variant
    // Keep only appropriate images (black variant images)
    images: product.images ? product.images.filter(img => {
      if (!img.altText) return img.isPrimary;
      
      const altTextLower = img.altText.toLowerCase();
      return (
        altTextLower.includes('black') ||
        altTextLower.includes('đen') ||
        /\w+black/i.test(img.altText) ||
        (altTextLower.includes('back') && !altTextLower.includes('white')) ||
        (img.isPrimary && !altTextLower.includes('white') && !altTextLower.includes('trắng'))
      );
    }) : []
  };
};