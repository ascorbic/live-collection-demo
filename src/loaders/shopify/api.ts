import { executeGraphQL } from './client.js';
import type { ShopifyProduct, ShopifyCollection, ProductCollectionFilter, CollectionCollectionFilter } from './types.js';

const PRODUCTS_QUERY = `
  query GetProducts($first: Int, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          id
          title
          description
          handle
          tags
          availableForSale
          createdAt
          updatedAt
          publishedAt
          vendor
          productType
          featuredImage {
            id
            url
            altText
            width
            height
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query GetProduct($id: ID, $handle: String) {
    product(id: $id, handle: $handle) {
      id
      title
      description
      handle
      tags
      availableForSale
      createdAt
      updatedAt
      publishedAt
      vendor
      productType
      featuredImage {
        id
        url
        altText
        width
        height
      }
      images(first: 20) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query GetCollections($first: Int, $query: String, $sortKey: CollectionSortKeys, $reverse: Boolean) {
    collections(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          id
          title
          description
          handle
          updatedAt
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `
  query GetCollection($id: ID, $handle: String, $productsFirst: Int) {
    collection(id: $id, handle: $handle) {
      id
      title
      description
      handle
      updatedAt
      image {
        id
        url
        altText
        width
        height
      }
      products(first: $productsFirst) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            availableForSale
            createdAt
            updatedAt
            publishedAt
            vendor
            productType
            featuredImage {
              id
              url
              altText
              width
              height
            }
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 3) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export function transformProduct(productData: any): ShopifyProduct {
  return {
    id: productData.id,
    title: productData.title,
    description: productData.description,
    handle: productData.handle,
    tags: productData.tags || [],
    availableForSale: productData.availableForSale,
    createdAt: productData.createdAt,
    updatedAt: productData.updatedAt,
    publishedAt: productData.publishedAt,
    vendor: productData.vendor,
    productType: productData.productType,
    featuredImage: productData.featuredImage,
    images: productData.images?.edges?.map((edge: any) => edge.node) || [],
    variants: productData.variants?.edges?.map((edge: any) => edge.node) || [],
    priceRange: productData.priceRange,
    compareAtPriceRange: productData.compareAtPriceRange,
  };
}

export function transformCollection(collectionData: any): ShopifyCollection {
  const collection: ShopifyCollection = {
    id: collectionData.id,
    title: collectionData.title,
    description: collectionData.description,
    handle: collectionData.handle,
    updatedAt: collectionData.updatedAt,
    image: collectionData.image,
  };

  if (collectionData.products) {
    collection.products = {
      edges: collectionData.products.edges.map((edge: any) => ({
        node: transformProduct(edge.node),
      })),
    };
  }

  return collection;
}

export async function getShopifyProducts(
  apiUrl: string,
  filter?: ProductCollectionFilter
): Promise<ShopifyProduct[]> {
  const variables: any = {
    first: filter?.first || 20,
  };

  if (filter?.query) variables.query = filter.query;
  if (filter?.sortKey) variables.sortKey = filter.sortKey;
  if (filter?.reverse !== undefined) variables.reverse = filter.reverse;

  const data = await executeGraphQL(PRODUCTS_QUERY, variables, apiUrl);
  let products = data.products?.edges?.map((edge: any) => transformProduct(edge.node)) || [];

  // Apply client-side filters that GraphQL doesn't support
  if (filter?.available !== undefined) {
    products = products.filter((product: ShopifyProduct) => 
      product.availableForSale === filter.available
    );
  }

  if (filter?.productType) {
    products = products.filter((product: ShopifyProduct) => 
      product.productType?.toLowerCase().includes(filter.productType!.toLowerCase())
    );
  }

  if (filter?.vendor) {
    products = products.filter((product: ShopifyProduct) => 
      product.vendor?.toLowerCase().includes(filter.vendor!.toLowerCase())
    );
  }

  return products;
}

export async function getShopifyProduct(
  apiUrl: string,
  identifier: { id?: string; handle?: string }
): Promise<ShopifyProduct | null> {
  const variables: any = {};

  if (identifier.id) {
    if (identifier.id.startsWith('gid://')) {
      variables.id = identifier.id;
    } else {
      variables.handle = identifier.id;
    }
  } else if (identifier.handle) {
    variables.handle = identifier.handle;
  } else {
    throw new Error('Either id or handle must be provided');
  }

  const data = await executeGraphQL(PRODUCT_QUERY, variables, apiUrl);
  return data.product ? transformProduct(data.product) : null;
}

export async function getShopifyCollections(
  apiUrl: string,
  filter?: CollectionCollectionFilter
): Promise<ShopifyCollection[]> {
  const variables: any = {
    first: filter?.first || 10,
  };

  if (filter?.query) variables.query = filter.query;
  if (filter?.sortKey) variables.sortKey = filter.sortKey;
  if (filter?.reverse !== undefined) variables.reverse = filter.reverse;

  const data = await executeGraphQL(COLLECTIONS_QUERY, variables, apiUrl);
  return data.collections?.edges?.map((edge: any) => transformCollection(edge.node)) || [];
}

export async function getShopifyCollection(
  apiUrl: string,
  identifier: { id?: string; handle?: string }
): Promise<ShopifyCollection | null> {
  const variables: any = {
    productsFirst: 20,
  };

  if (identifier.id) {
    if (identifier.id.startsWith('gid://')) {
      variables.id = identifier.id;
    } else {
      variables.handle = identifier.id;
    }
  } else if (identifier.handle) {
    variables.handle = identifier.handle;
  } else {
    throw new Error('Either id or handle must be provided');
  }

  const data = await executeGraphQL(COLLECTION_QUERY, variables, apiUrl);
  return data.collection ? transformCollection(data.collection) : null;
}