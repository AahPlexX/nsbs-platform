# TypeScript 5.9.2 Configuration Guide

Comprehensive guide for TypeScript 5.9.2 configuration and patterns in the NSBS Platform.

## 📋 Table of Contents

- [Configuration Overview](#configuration-overview)
- [Compiler Options](#compiler-options)
- [Strict Type Checking](#strict-type-checking)
- [Module System](#module-system)
- [Import Patterns](#import-patterns)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Configuration Overview

The NSBS Platform uses TypeScript 5.9.2 with maximum strictness enabled for production-grade type safety.

### Key Configuration Files

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["ES2024", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "allowJs": false,
    "checkJs": false,
    "useDefineForClassFields": true,
    "noEmit": true,
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "useUnknownInCatchVariables": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Compiler Options

### Target and Libraries

```typescript
/**
 * Target ES2024 for maximum language feature support
 * Includes DOM types for browser compatibility
 */
{
  "target": "ES2024",
  "lib": ["ES2024", "DOM", "DOM.Iterable"]
}
```

### Module Resolution

```typescript
/**
 * ESNext modules with bundler resolution for Next.js compatibility
 * Enables verbatim module syntax for type-only imports
 */
{
  "module": "esnext",
  "moduleResolution": "bundler",
  "verbatimModuleSyntax": true,
  "isolatedModules": true
}
```

## Strict Type Checking

### Core Strictness

```typescript
/**
 * Maximum strictness configuration for production safety
 */
{
  "strict": true,                          // All strict family checks
  "noImplicitAny": true,                   // Covered by strict
  "noImplicitThis": true,                  // Covered by strict
  "alwaysStrict": true,                    // Covered by strict
  "strictBindCallApply": true,             // Covered by strict
  "strictFunctionTypes": true,             // Covered by strict
  "strictNullChecks": true,                // Covered by strict
  "strictPropertyInitialization": true,   // Covered by strict
  "useUnknownInCatchVariables": true      // TS 4.4+ catch variables as unknown
}
```

### Additional Safety Checks

```typescript
/**
 * Enhanced safety beyond standard strict mode
 */
{
  "exactOptionalPropertyTypes": true,      // Exact optional property handling
  "noUncheckedIndexedAccess": true,       // Safe array/object access
  "noUnusedLocals": true,                 // No unused variables
  "noUnusedParameters": true,             // No unused parameters
  "noImplicitReturns": true,              // All code paths return
  "noFallthroughCasesInSwitch": true,     // Switch case safety
  "noImplicitOverride": true              // Explicit override keyword
}
```

## Module System

### ESM Import Patterns

```typescript
/**
 * Demonstrates proper ESM import syntax for TypeScript 5.9.2
 * 
 * @example Standard imports
 * ```typescript
 * // Default import
 * import React from 'react'
 * 
 * // Named imports
 * import { useState, useEffect } from 'react'
 * 
 * // Type-only imports (enforced by verbatimModuleSyntax)
 * import type { User, Course } from '@/lib/types'
 * import type { ComponentProps } from 'react'
 * ```
 */

/**
 * @example Dynamic imports for code splitting
 * ```typescript
 * // Dynamic component loading
 * const LazyComponent = React.lazy(() => import('./LazyComponent'))
 * 
 * // Conditional module loading
 * if (condition) {
 *   const { utilityFunction } = await import('./utils')
 *   utilityFunction()
 * }
 * ```
 */

/**
 * @example JSON module imports with attributes
 * ```typescript
 * // TS 5.9.2 import attributes syntax
 * import config from './config.json' with { type: 'json' }
 * import packageJson from '../package.json' with { type: 'json' }
 * 
 * // Type-safe JSON access
 * const version: string = packageJson.version
 * ```
 */
```

### Export Patterns

```typescript
/**
 * Demonstrates proper export patterns for TypeScript 5.9.2
 * 
 * @example Named exports (preferred)
 * ```typescript
 * export const API_BASE_URL = 'https://api.example.com'
 * export const MAX_RETRY_ATTEMPTS = 3
 * 
 * export function fetchUser(id: string): Promise<User> {
 *   // Implementation
 * }
 * 
 * export class UserService {
 *   // Implementation
 * }
 * ```
 */

/**
 * @example Type-only exports
 * ```typescript
 * // Export types without runtime impact
 * export type { User, Course, Enrollment } from './types'
 * 
 * // Re-export with type-only
 * export type { ComponentProps } from 'react'
 * ```
 */

/**
 * @example Default exports (limited use)
 * ```typescript
 * // Only for single-purpose modules
 * export default function HomePage() {
 *   return <div>Home Page</div>
 * }
 * ```
 */
```

## Type Definitions

### Zero 'any' Policy

```typescript
/**
 * Demonstrates proper typing patterns without 'any'
 * 
 * @example Use 'unknown' for untyped values
 * ```typescript
 * // ❌ Avoid
 * function processData(data: any): any {
 *   return data.someProperty
 * }
 * 
 * // ✅ Correct
 * function processData(data: unknown): string {
 *   if (typeof data === 'object' && data !== null && 'someProperty' in data) {
 *     const obj = data as Record<string, unknown>
 *     if (typeof obj.someProperty === 'string') {
 *       return obj.someProperty
 *     }
 *   }
 *   throw new Error('Invalid data format')
 * }
 * ```
 */

/**
 * @example Proper generic constraints
 * ```typescript
 * // ❌ Avoid
 * function clone<T = any>(obj: T): T {
 *   return JSON.parse(JSON.stringify(obj))
 * }
 * 
 * // ✅ Correct
 * function clone<T extends Record<string, unknown>>(obj: T): T {
 *   return JSON.parse(JSON.stringify(obj)) as T
 * }
 * ```
 */
```

### Discriminated Unions

```typescript
/**
 * Demonstrates proper discriminated union patterns
 * 
 * @example API Response types
 * ```typescript
 * interface SuccessResponse<T> {
 *   readonly success: true
 *   readonly data: T
 * }
 * 
 * interface ErrorResponse {
 *   readonly success: false
 *   readonly error: string
 *   readonly code?: string
 * }
 * 
 * type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
 * 
 * // Usage with type narrowing
 * function handleResponse<T>(response: ApiResponse<T>): T {
 *   if (response.success) {
 *     // TypeScript knows this is SuccessResponse<T>
 *     return response.data
 *   } else {
 *     // TypeScript knows this is ErrorResponse
 *     throw new Error(response.error)
 *   }
 * }
 * ```
 */

/**
 * @example Component State patterns
 * ```typescript
 * interface LoadingState {
 *   readonly status: 'loading'
 * }
 * 
 * interface SuccessState<T> {
 *   readonly status: 'success'
 *   readonly data: T
 * }
 * 
 * interface ErrorState {
 *   readonly status: 'error'
 *   readonly error: string
 * }
 * 
 * type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState
 * ```
 */
```

### Readonly Patterns

```typescript
/**
 * Demonstrates readonly patterns for immutable data
 * 
 * @example Readonly objects
 * ```typescript
 * interface ReadonlyUser {
 *   readonly id: string
 *   readonly email: string
 *   readonly profile: {
 *     readonly name: string
 *     readonly avatarUrl?: string
 *   }
 * }
 * 
 * // Deep readonly utility
 * type DeepReadonly<T> = {
 *   readonly [P in keyof T]: T[P] extends Record<string, unknown>
 *     ? DeepReadonly<T[P]>
 *     : T[P]
 * }
 * ```
 */

/**
 * @example Readonly arrays and tuples
 * ```typescript
 * // Readonly array
 * type ReadonlyStringArray = readonly string[]
 * 
 * // Readonly tuple
 * type Coordinates = readonly [number, number]
 * 
 * // Const assertions for literal types
 * const colors = ['red', 'green', 'blue'] as const
 * type Color = typeof colors[number] // 'red' | 'green' | 'blue'
 * ```
 */
```

## Error Handling

### Unknown Type Narrowing

```typescript
/**
 * Demonstrates proper error handling with unknown types
 * 
 * @example Safe error processing
 * ```typescript
 * function handleError(error: unknown): string {
 *   // Type narrowing for Error objects
 *   if (error instanceof Error) {
 *     return error.message
 *   }
 * 
 *   // Type narrowing for string errors
 *   if (typeof error === 'string') {
 *     return error
 *   }
 * 
 *   // Type narrowing for objects with message property
 *   if (
 *     typeof error === 'object' &&
 *     error !== null &&
 *     'message' in error &&
 *     typeof (error as Record<string, unknown>).message === 'string'
 *   ) {
 *     return (error as { message: string }).message
 *   }
 * 
 *   // Fallback for unknown error types
 *   return 'An unknown error occurred'
 * }
 * ```
 */

/**
 * @example Async error handling
 * ```typescript
 * async function safeApiCall<T>(
 *   apiCall: () => Promise<T>
 * ): Promise<ApiResponse<T>> {
 *   try {
 *     const data = await apiCall()
 *     return { success: true, data } as const
 *   } catch (error: unknown) {
 *     const message = handleError(error)
 *     return { success: false, error: message } as const
 *   }
 * }
 * ```
 */
```

### Type Guards

```typescript
/**
 * Demonstrates custom type guard patterns
 * 
 * @example User-defined type guards
 * ```typescript
 * function isUser(value: unknown): value is User {
 *   return (
 *     typeof value === 'object' &&
 *     value !== null &&
 *     'id' in value &&
 *     'email' in value &&
 *     typeof (value as Record<string, unknown>).id === 'string' &&
 *     typeof (value as Record<string, unknown>).email === 'string'
 *   )
 * }
 * 
 * function isArrayOf<T>(
 *   value: unknown,
 *   guard: (item: unknown) => item is T
 * ): value is T[] {
 *   return Array.isArray(value) && value.every(guard)
 * }
 * 
 * // Usage
 * if (isUser(unknownData)) {
 *   // TypeScript knows unknownData is User
 *   console.log(unknownData.email)
 * }
 * 
 * if (isArrayOf(unknownArray, isUser)) {
 *   // TypeScript knows unknownArray is User[]
 *   unknownArray.forEach(user => console.log(user.email))
 * }
 * ```
 */
```

## Best Practices

### Satisfies Operator

```typescript
/**
 * Demonstrates the 'satisfies' operator for type narrowing
 * 
 * @example Configuration objects
 * ```typescript
 * const config = {
 *   database: {
 *     host: 'localhost',
 *     port: 5432,
 *     ssl: false
 *   },
 *   redis: {
 *     host: 'localhost',
 *     port: 6379
 *   }
 * } satisfies Record<string, { host: string; port: number; ssl?: boolean }>
 * 
 * // TypeScript maintains exact type while ensuring constraint
 * config.database.ssl // boolean | undefined (exact type)
 * config.redis.ssl    // undefined (exact type, no ssl property)
 * ```
 */

/**
 * @example Route configuration
 * ```typescript
 * const routes = {
 *   home: '/',
 *   about: '/about',
 *   contact: '/contact',
 *   blog: '/blog'
 * } satisfies Record<string, string>
 * 
 * type RouteName = keyof typeof routes // 'home' | 'about' | 'contact' | 'blog'
 * ```
 */
```

### Const Assertions

```typescript
/**
 * Demonstrates const assertions for literal type preservation
 * 
 * @example Status constants
 * ```typescript
 * const STATUS = {
 *   LOADING: 'loading',
 *   SUCCESS: 'success',
 *   ERROR: 'error'
 * } as const
 * 
 * type Status = typeof STATUS[keyof typeof STATUS] // 'loading' | 'success' | 'error'
 * ```
 */

/**
 * @example Array as tuple
 * ```typescript
 * const priorities = ['low', 'medium', 'high'] as const
 * type Priority = typeof priorities[number] // 'low' | 'medium' | 'high'
 * 
 * // Tuple with exact length
 * const rgb = [255, 128, 0] as const
 * type RGB = typeof rgb // readonly [255, 128, 0]
 * ```
 */
```

### Template Literal Types

```typescript
/**
 * Demonstrates template literal types for string manipulation
 * 
 * @example API endpoint generation
 * ```typescript
 * type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
 * type ApiVersion = 'v1' | 'v2'
 * type Resource = 'users' | 'courses' | 'certificates'
 * 
 * type ApiEndpoint = `/api/${ApiVersion}/${Resource}`
 * // "/api/v1/users" | "/api/v1/courses" | ... etc
 * 
 * type HttpRequest = `${HttpMethod} ${ApiEndpoint}`
 * // "GET /api/v1/users" | "POST /api/v1/courses" | ... etc
 * ```
 */

/**
 * @example CSS class generation
 * ```typescript
 * type Size = 'sm' | 'md' | 'lg'
 * type Variant = 'primary' | 'secondary' | 'outline'
 * 
 * type ButtonClass = `btn-${Size}-${Variant}`
 * // "btn-sm-primary" | "btn-sm-secondary" | ... etc
 * ```
 */
```

---

This TypeScript configuration ensures maximum type safety and follows all TypeScript 5.9.2 best practices for production applications.