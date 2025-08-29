# NSBS Platform Documentation

Comprehensive TSDoc-formatted documentation for the NSBS Platform - a Next.js 15.5.0 App Router project with React 19.1.1 and TypeScript 5.9.2.

## 📚 Documentation Structure

### Core Architecture
- [TypeScript Configuration](./typescript/README.md) - TS 5.9.2 strict configuration and patterns
- [App Router Patterns](./app-router/README.md) - Next.js 15.5.0 App Router implementation
- [Component Architecture](./components/README.md) - Server/Client component patterns

### Integration Guides
- [Supabase SSR Integration](./integrations/supabase/README.md) - Database and auth patterns
- [Stripe Payment Processing](./integrations/stripe/README.md) - Payment flows and webhooks
- [Radix UI Components](./integrations/radix/README.md) - Accessible component primitives
- [HeroUI Theming](./integrations/heroui/README.md) - Advanced UI components and theming
- [Tailwind CSS 4.1.12](./integrations/tailwind/README.md) - CSS-first styling patterns

### API Documentation
- [Route Handlers](./api/README.md) - API route patterns and implementations
- [Server Actions](./server-actions/README.md) - Form handling and mutations
- [Middleware](./middleware/README.md) - Authentication and security

### Type System
- [Type Definitions](./types/README.md) - Comprehensive type system
- [Validation Schemas](./validation/README.md) - Zod 4.1.1 patterns
- [Database Types](./database/README.md) - Supabase type generation

### Examples
- [Server Components](./examples/server-components.md) - Data fetching patterns
- [Client Components](./examples/client-components.md) - Interactive components
- [Error Handling](./examples/error-handling.md) - Unknown type narrowing
- [Bundle Optimization](./examples/bundle-optimization.md) - Code splitting strategies

## 🎯 Key Features

### TypeScript 5.9.2 Compliance
- **Zero 'any' types**: Strict typing throughout the codebase
- **ESM imports**: Proper module syntax with type-only imports
- **Verbatim module syntax**: Compliance with TS 5.9.2 requirements
- **Import attributes**: JSON modules with proper syntax

### Next.js 15.5.0 App Router
- **Server Components by default**: Optimal rendering strategy
- **Client boundaries**: Proper 'use client' directive usage
- **Metadata API**: SEO and head management
- **Route groups**: Organized routing structure

### Integration Excellence
- **Supabase 2.56.0**: SSR-ready database and authentication
- **Stripe 18.4.0**: Secure payment processing
- **Radix UI**: Accessible component primitives
- **HeroUI 2.8.2**: Advanced theming and components
- **Tailwind CSS 4.1.12**: CSS-first configuration

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## 📖 Documentation Standards

All documentation follows:
- **TSDoc format**: Standardized documentation comments
- **TypeScript 5.9.2**: Latest language features and patterns
- **Production-ready**: Real-world implementation examples
- **Self-contained**: Complete examples without external dependencies

## 🔧 Development Guidelines

### Type Safety
- Use `unknown` instead of `any` for untyped values
- Implement proper type narrowing for error handling
- Utilize discriminated unions for state management
- Apply readonly patterns for immutable data

### Component Patterns
- Server Components for data fetching
- Client Components for interactivity only
- Proper prop typing without React.FC
- Exact object types for component props

### Import Conventions
```typescript
// Type-only imports
import type { User } from '@/lib/types'

// Regular imports
import { Button } from '@/components/ui/button'

// JSON modules with import attributes
import config from './config.json' with { type: 'json' }
```

## 📋 Checklist for Contributors

- [ ] All code follows TypeScript 5.9.2 strict configuration
- [ ] No usage of 'any' types anywhere in the codebase
- [ ] TSDoc comments for all public APIs
- [ ] Proper Server/Client component boundaries
- [ ] ESM imports with type-only imports where appropriate
- [ ] Error handling with unknown type narrowing
- [ ] Integration patterns follow documented examples

---

This documentation serves as the authoritative source for the NSBS Platform's architecture, patterns, and implementation guidelines.