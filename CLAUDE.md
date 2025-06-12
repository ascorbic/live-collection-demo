# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a demonstration project for Astro's experimental live content collections feature using a Shopify loader that fetches data from [mock.shop](https://mock.shop) at runtime. The project showcases live data fetching, type-safe filtering, error handling, and cache optimization.

## Development Commands

- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm preview` - Preview production build locally
- `pnpm install` - Install dependencies

## Live Collections Architecture

### Core Concept
Live collections fetch data at request time rather than build time, enabling real-time updates without rebuilds. This project demonstrates the pattern with a Shopify API integration.

### Configuration Requirements
- Enable `experimental.liveContentCollections: true` in `astro.config.mjs`
- Define collections in `src/live.config.ts` using `defineCollection` from `"astro:content"`
- Use `type: "live"` and provide a loader instance
- All pages using live collections must set `export const prerender = false`

### Loader Architecture Pattern
The Shopify loader demonstrates a clean 3-layer architecture:

1. **API Layer** (`src/loaders/shopify/api.ts`) - GraphQL queries, data transformation, and business logic
2. **Client Layer** (`src/loaders/shopify/client.ts`) - HTTP transport and error handling
3. **Loader Layer** (`src/loaders/shopify/*-loader.ts`) - Live collection interface implementation

### Loader Factory Pattern
Loaders are created as factory functions that accept configuration:
```ts
createProductLoader({ apiUrl: string })
createCollectionLoader({ apiUrl: string })
```

This allows the same loader to work with different APIs by passing different URLs.

### Error Handling Strategy
- Custom error types (`ShopifyLoaderError`) with error codes for specific failure modes
- Loaders catch all errors and return them rather than throwing
- Pages can check `error` property and handle gracefully (redirect to 404, show error UI)

### Type Safety Implementation
- TypeScript interfaces for all data types (`ShopifyProduct`, `ShopifyCollection`, etc.)
- Separate filter types for collection queries (`ProductCollectionFilter`) and entry queries (`ProductEntryFilter`)
- Generic `LiveLoader<DataType, EntryFilter, CollectionFilter, ErrorType>` provides full type safety

### Cache Hint Pattern
Loaders return cache hints with each response:
```ts
cacheHint: {
  tags: ['products', `product-${handle}`],
  maxAge: 600 // seconds
}
```

### Pages Architecture
- **Homepage** (`/`) - Overview with featured products and collections
- **Products** (`/products`) - Filtered listing with search, sorting, availability filters
- **Product Details** (`/products/[handle]`) - Individual product with variants
- **Collections** (`/collections`) - Collection listing with search/sort
- **Collection Details** (`/collections/[handle]`) - Collection with contained products

### GraphQL Integration
The API layer uses GraphQL with mock.shop, demonstrating:
- Query composition for different data needs
- Data transformation from GraphQL response to TypeScript interfaces
- Client-side filtering for capabilities not supported by the API

## Important Implementation Notes

- Live collections import `defineCollection` from `"astro:content"`, not `"astro/config"`
- Export syntax is `export const collections = { name: collectionDef }`
- Server-side rendering is required: `export const prerender = false`
- The `live-collections.md` file contains comprehensive documentation on the live collections feature