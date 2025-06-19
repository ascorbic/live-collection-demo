import type { LiveLoader } from "astro/loaders";
import { getShopifyCollections, getShopifyCollection } from "./api.js";
import type {
  ShopifyCollection,
  CollectionCollectionFilter,
  CollectionEntryFilter,
} from "./types.js";
import { ShopifyLoaderError } from "./types.js";

export function createCollectionLoader(config: {
  apiUrl: string;
  token?: string;
}): LiveLoader<
  ShopifyCollection,
  CollectionEntryFilter,
  CollectionCollectionFilter,
  ShopifyLoaderError
> {
  return {
    name: "shopify-collection-loader",

    loadCollection: async ({ filter }) => {
      try {
        const collections = await getShopifyCollections(config.apiUrl, filter);

        return {
          entries: collections.map((collection) => ({
            id: collection.handle,
            data: collection,
          })),
          cacheHint: {
            tags: ["collections"],
          },
        };
      } catch (error) {
        return {
          error:
            error instanceof ShopifyLoaderError
              ? error
              : new ShopifyLoaderError(
                  `Failed to load collections: ${
                    error instanceof Error ? error.message : String(error)
                  }`,
                  "LOAD_COLLECTION_ERROR"
                ),
        };
      }
    },

    loadEntry: async ({ filter }) => {
      try {
        const collection = await getShopifyCollection(config.apiUrl, filter);

        if (!collection) {
          return;
        }

        return {
          id: collection.handle,
          data: collection,
          cacheHint: {
            tags: [`collection-${collection.handle}`],
            maxAge: 900, // 15 minutes
          },
        };
      } catch (error) {
        return {
          error:
            error instanceof ShopifyLoaderError
              ? error
              : new ShopifyLoaderError(
                  `Failed to load collection: ${
                    error instanceof Error ? error.message : String(error)
                  }`,
                  "LOAD_ENTRY_ERROR"
                ),
        };
      }
    },
  };
}
