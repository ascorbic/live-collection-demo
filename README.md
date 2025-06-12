# Astro Live Collections Demo

A demonstration of Astro's experimental **live content collections** feature using a Shopify loader that fetches data from [mock.shop](https://mock.shop) at runtime.

## ✨ Features

- **Live Data Fetching** - Products and collections loaded at request time, not build time
- **Type-Safe Filtering** - Rich filtering capabilities with TypeScript support
- **Error Handling** - Robust error handling with custom error types
- **Cache Optimization** - Smart cache hints for performance
- **Real-Time Updates** - No rebuilds needed when data changes

## 🏗️ Live Collections Architecture

This demo showcases how to build live collection loaders:

- **`src/loaders/shopify/`** - Modular loader architecture
- **`src/live.config.ts`** - Live collections configuration
- **`src/pages/`** - Runtime data fetching examples

## 🚀 Key Demo Pages

- **Homepage** (`/`) - Featured products and collections overview
- **Products** (`/products`) - Filterable product listing with search, sorting, and availability filters
- **Product Details** (`/products/[handle]`) - Individual product pages with variants

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
