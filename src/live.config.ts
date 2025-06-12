import { defineCollection } from "astro:content";
import {
  createProductLoader,
  createCollectionLoader,
} from "./loaders/shopify/index.js";

const MOCK_SHOP_API_URL = "https://mock.shop/api";

const products = defineCollection({
  type: "live",
  loader: createProductLoader({ apiUrl: MOCK_SHOP_API_URL }),
});

const loader = createCollectionLoader({ apiUrl: MOCK_SHOP_API_URL });

const shopifyCollections = defineCollection({
  type: "live",
  loader,
});

export const collections = { products, collections: shopifyCollections };
