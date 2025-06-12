export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: ShopifyImage;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  tags: string[];
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  vendor?: string;
  productType?: string;
  featuredImage?: ShopifyImage;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  description: string;
  handle: string;
  updatedAt: string;
  image?: ShopifyImage;
  products?: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export type SortKey = 'TITLE' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'ID' | 'BEST_SELLING' | 'RELEVANCE';

export interface ProductCollectionFilter {
  /** Maximum number of products to return */
  first?: number;
  /** Search query for product titles and descriptions */
  query?: string;
  /** Filter by product availability */
  available?: boolean;
  /** Sort products by specified key */
  sortKey?: SortKey;
  /** Reverse the sort order */
  reverse?: boolean;
  /** Filter by product type */
  productType?: string;
  /** Filter by vendor */
  vendor?: string;
}

export interface ProductEntryFilter {
  /** Product ID (when using string syntax) */
  id?: string;
  /** Product handle/slug */
  handle?: string;
}

export interface CollectionCollectionFilter {
  /** Maximum number of collections to return */
  first?: number;
  /** Search query for collection titles */
  query?: string;
  /** Sort collections by specified key */
  sortKey?: 'TITLE' | 'ID' | 'UPDATED_AT';
  /** Reverse the sort order */
  reverse?: boolean;
}

export interface CollectionEntryFilter {
  /** Collection ID (when using string syntax) */
  id?: string;
  /** Collection handle/slug */
  handle?: string;
}

export class ShopifyLoaderError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ShopifyLoaderError';
  }
}