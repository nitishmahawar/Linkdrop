# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build for production
- `pnpm test` - Run tests with Vitest
- `pnpm serve` - Preview production build

## Architecture Overview

This is a **linkdrop application** built with modern web technologies for saving and organizing links with automatic metadata fetching, categories, and tags.

### Tech Stack
- **Framework**: TanStack Router with file-based routing and React Start
- **Styling**: Tailwind CSS v4 with Shadcn UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with session-based auth
- **API**: ORPC for type-safe RPC calls
- **State Management**: TanStack Query
- **Package Manager**: pnpm (required)

### Directory Structure

**Core App Structure**:
- `src/routes/` - File-based routing with TanStack Router
- `src/components/` - React components organized by feature
- `src/orpc/` - RPC API routes and procedures
- `src/lib/` - Utility functions and configurations

**Key Directories**:
- `src/components/ui/` - Shadcn UI components
- `src/components/links/` - Link-related components (cards, dialogs, lists)
- `src/orpc/router/` - API routers organized by domain (links, categories, tags, metadata)

### Database Schema

The application uses a user-scoped multi-tenant architecture:

**Core Models**:
- `User` - User accounts with authentication
- `Link` - Saved URLs with metadata (title, description, favicon, preview image)
- `Category` - User-defined categories for organizing links
- `Tag` - User-defined tags for organizing links
- `LinkCategory` / `LinkTag` - Many-to-many relationships

All user content is scoped by `userId` for proper data isolation.

### Authentication Flow

- Session-based authentication using Better Auth
- Protected routes automatically redirect to `/login` if not authenticated
- Authenticated users redirected from `/login` to home
- Session management handled in `src/lib/auth-client.ts`

### API Architecture

**ORPC Setup**:
- Base procedure for public endpoints
- Protected procedure with session validation for user-specific operations
- Modular routers: `links`, `categories`, `tags`, `metadata`
- Type-safe client with TanStack Query integration

**Key Procedures**:
- Links CRUD operations with user filtering
- Category and tag management
- Metadata fetching for automatic link information extraction

### Frontend Patterns

**Component Organization**:
- Feature-based component structure
- Reusable UI components from Shadcn
- Custom hooks for data fetching with TanStack Query
- Form handling with React Hook Form and Zod validation

**Routing**:
- File-based routing in `src/routes/`
- Root layout with authentication checks in `__root.tsx`
- Lazy loading and data fetching support

### Development Notes

- Use arrow functions (per user preferences)
- Prefer interfaces over types (per user preferences)
- Environment variables managed in `src/env.ts`
- Prisma client generated to `src/generated/prisma/`
- Tailwind CSS v4 with Vite integration