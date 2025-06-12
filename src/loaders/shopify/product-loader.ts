import type { LiveLoader } from 'astro/loaders';
import { getShopifyProducts, getShopifyProduct } from './api.js';
import type { 
  ShopifyProduct, 
  ProductCollectionFilter, 
  ProductEntryFilter
} from './types.js';
import { ShopifyLoaderError } from './types.js';

export function createProductLoader(config: { apiUrl: string }): LiveLoader<
  ShopifyProduct,
  ProductEntryFilter,
  ProductCollectionFilter,
  ShopifyLoaderError
> {
  return {
    name: 'shopify-product-loader',
    
    loadCollection: async ({ filter }) => {
      try {
        const products = await getShopifyProducts(config.apiUrl, filter);

        return {
          entries: products.map(product => ({
            id: product.handle,
            data: product,
          })),
          cacheHint: {
            tags: ['products'],
            maxAge: 300, // 5 minutes
          },
        };
      } catch (error) {
        return {
          error: error instanceof ShopifyLoaderError 
            ? error 
            : new ShopifyLoaderError(
                `Failed to load products: ${error instanceof Error ? error.message : String(error)}`,
                'LOAD_COLLECTION_ERROR'
              ),
        };
      }
    },

    loadEntry: async ({ filter }) => {
      try {
        const product = await getShopifyProduct(config.apiUrl, filter);

        if (!product) {
          return {
            error: new ShopifyLoaderError(
              'Product not found',
              'PRODUCT_NOT_FOUND'
            ),
          };
        }

        return {
          id: product.handle,
          data: product,
          cacheHint: {
            tags: [`product-${product.handle}`, 'products'],
            maxAge: 600, // 10 minutes
          },
        };
      } catch (error) {
        return {
          error: error instanceof ShopifyLoaderError 
            ? error 
            : new ShopifyLoaderError(
                `Failed to load product: ${error instanceof Error ? error.message : String(error)}`,
                'LOAD_ENTRY_ERROR'
              ),
        };
      }
    },
  };
}