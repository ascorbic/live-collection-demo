# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a demonstration project for Astro's experimental live content collections feature. It's based on the Astro "basics" starter template and serves as a sandbox for testing live content collections that fetch data at runtime rather than build time.

## Development Commands

- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm preview` - Preview production build locally
- `pnpm install` - Install dependencies

## Key Architecture

- **Astro Framework**: Uses Astro 5.9.2+ with TypeScript strict mode
- **Package Manager**: Uses pnpm with specific version (9.15.9)
- **Live Collections**: The main feature being demonstrated - allows runtime data fetching vs build-time
- **Configuration**: Standard Astro config in `astro.config.mjs`, TypeScript config extends "astro/tsconfigs/strict"

## Live Content Collections

This project demonstrates Astro's experimental live content collections:

- Enable with `experimental.liveContentCollections: true` in astro.config.mjs  
- Define collections in `src/live.config.ts` (not `src/content.config.ts`)
- Use `getLiveCollection()` and `getLiveEntry()` instead of standard collection functions
- Collections fetch data at request time, not build time
- Ideal for frequently-updated data, real-time information, or dynamic filtering

The included `live-collections.md` file contains comprehensive documentation on the feature including loader creation, error handling, type safety, and cache hints.

## File Structure

- `src/pages/index.astro` - Main page using Welcome component
- `src/layouts/Layout.astro` - Base HTML layout
- `src/components/Welcome.astro` - Main content component
- `live-collections.md` - Detailed documentation on live collections feature