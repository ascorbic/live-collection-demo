import { defineLiveCollection } from "astro:content";
import { z } from "astro/zod";
import {
  createProductLoader,
  createCollectionLoader,
} from "./loaders/shopify/index.js";

const MOCK_SHOP_API_URL = "https://mock.shop/api";

const products = defineLiveCollection({
  type: "live",
  loader: createProductLoader({ apiUrl: MOCK_SHOP_API_URL }),
});

const loader = createCollectionLoader({ apiUrl: MOCK_SHOP_API_URL });

const shopifyCollections = defineLiveCollection({
  type: "live",
  loader,
});

export const collections = { products, collections: shopifyCollections };
