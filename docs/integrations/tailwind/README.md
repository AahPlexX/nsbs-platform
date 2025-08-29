# Tailwind CSS 4.1.12 Integration Guide

Comprehensive guide for Tailwind CSS 4.1.12 CSS-first configuration with Next.js 15.5.0 App Router and TypeScript 5.9.2.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [CSS-First Configuration](#css-first-configuration)
- [Theme Customization](#theme-customization)
- [Component Styling Patterns](#component-styling-patterns)
- [Responsive Design](#responsive-design)
- [Dark Mode Implementation](#dark-mode-implementation)
- [Animation and Transitions](#animation-and-transitions)
- [Performance Optimization](#performance-optimization)
- [Utility Patterns](#utility-patterns)
- [Best Practices](#best-practices)

## Architecture Overview

The NSBS Platform uses Tailwind CSS 4.1.12 with CSS-first configuration for optimal performance, maintainability, and design system consistency.

### Key Features

```typescript
/**
 * Tailwind CSS 4.1.12 architecture for the NSBS Platform.
 * 
 * @remarks
 * - CSS-first configuration with @theme and @plugin directives
 * - Custom design system with NSBS brand colors
 * - Responsive design with mobile-first approach
 * - Dark mode support with system preference detection
 * - Custom animations and component variants
 * - Performance optimized with automatic purging
 */

// postcss.config.mjs
export default {
  plugins: ['@tailwindcss/postcss']
} satisfies import('postcss').Config
```

## CSS-First Configuration

### Core CSS Setup

```css
/**
 * Tailwind CSS 4.1.12 CSS-first configuration.
 * 
 * @remarks
 * Uses @import for base styles and @theme/@plugin directives
 * for customization instead of JavaScript configuration.
 */

/* app/globals.css */
@import "tailwindcss";

/**
 * NSBS Platform Design System
 * Custom theme configuration using CSS-first approach
 */
@theme {
  --color-primary: oklch(50.4% 0.146 258.7);
  --color-primary-foreground: oklch(100% 0 0);
  
  --color-secondary: oklch(93.7% 0.008 258.7);
  --color-secondary-foreground: oklch(40% 0.05 258.7);
  
  --color-accent: oklch(95.3% 0.013 258.7);
  --color-accent-foreground: oklch(20% 0.05 258.7);
  
  --color-muted: oklch(95.3% 0.006 258.7);
  --color-muted-foreground: oklch(53.5% 0.015 258.7);
  
  --color-destructive: oklch(64.8% 0.15 23.1);
  --color-destructive-foreground: oklch(100% 0 0);
  
  --color-success: oklch(70.2% 0.13 142.1);
  --color-success-foreground: oklch(100% 0 0);
  
  --color-warning: oklch(78.9% 0.13 71.3);
  --color-warning-foreground: oklch(20% 0.05 71.3);
  
  --color-border: oklch(90.5% 0.005 258.7);
  --color-input: oklch(90.5% 0.005 258.7);
  --color-ring: oklch(50.4% 0.146 258.7);
  
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(10% 0.002 258.7);
  
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(10% 0.002 258.7);
  
  --color-popover: oklch(100% 0 0);
  --color-popover-foreground: oklch(10% 0.002 258.7);
  
  /* NSBS Brand Colors */
  --color-nsbs-blue: oklch(50.4% 0.146 258.7);
  --color-nsbs-blue-light: oklch(75.2% 0.08 258.7);
  --color-nsbs-blue-dark: oklch(35.8% 0.18 258.7);
  
  --color-nsbs-green: oklch(70.2% 0.13 142.1);
  --color-nsbs-green-light: oklch(85.5% 0.07 142.1);
  --color-nsbs-green-dark: oklch(55.1% 0.16 142.1);
  
  --color-nsbs-orange: oklch(78.9% 0.13 71.3);
  --color-nsbs-orange-light: oklch(90.2% 0.07 71.3);
  --color-nsbs-orange-dark: oklch(65.4% 0.16 71.3);
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  
  /* Typography Scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* Animation Durations */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}

/**
 * Dark mode color overrides
 */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-primary: oklch(67.5% 0.146 258.7);
    --color-primary-foreground: oklch(10% 0.002 258.7);
    
    --color-secondary: oklch(20% 0.02 258.7);
    --color-secondary-foreground: oklch(90% 0.008 258.7);
    
    --color-accent: oklch(25% 0.025 258.7);
    --color-accent-foreground: oklch(90% 0.008 258.7);
    
    --color-muted: oklch(20% 0.01 258.7);
    --color-muted-foreground: oklch(65% 0.02 258.7);
    
    --color-border: oklch(25% 0.015 258.7);
    --color-input: oklch(25% 0.015 258.7);
    
    --color-background: oklch(10% 0.002 258.7);
    --color-foreground: oklch(95% 0.005 258.7);
    
    --color-card: oklch(15% 0.005 258.7);
    --color-card-foreground: oklch(95% 0.005 258.7);
    
    --color-popover: oklch(15% 0.005 258.7);
    --color-popover-foreground: oklch(95% 0.005 258.7);
  }
}

/**
 * Custom component styles using @plugin directive
 */
@plugin {
  .btn-base {
    @apply inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all;
    @apply disabled:pointer-events-none disabled:opacity-50;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
  }
  
  .card-base {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
  
  .input-base {
    @apply flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm;
    @apply ring-offset-background transition-colors;
    @apply file:border-0 file:bg-transparent file:text-sm file:font-medium;
    @apply placeholder:text-muted-foreground;
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
    @apply disabled:cursor-not-allowed disabled:opacity-50;
  }
}

/**
 * Utility patterns for common use cases
 */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .text-pretty {
    text-wrap: pretty;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .animate-in {
    animation-duration: var(--duration-normal);
    animation-fill-mode: both;
  }
  
  .animate-out {
    animation-duration: var(--duration-fast);
    animation-fill-mode: both;
  }
}

/**
 * Component-specific styles
 */
@layer components {
  .prose {
    @apply text-foreground;
    @apply prose-headings:text-foreground prose-lead:text-muted-foreground;
    @apply prose-links:text-primary prose-links:underline-offset-4;
    @apply prose-strong:text-foreground prose-code:text-foreground;
    @apply prose-pre:bg-muted prose-pre:text-muted-foreground;
    @apply prose-ol:text-foreground prose-ul:text-foreground;
    @apply prose-blockquote:text-muted-foreground prose-blockquote:border-l-border;
    @apply prose-hr:border-border;
  }
  
  .course-card {
    @apply card-base overflow-hidden transition-all duration-300;
    @apply hover:shadow-md hover:-translate-y-1;
    @apply group cursor-pointer;
  }
  
  .lesson-content {
    @apply prose prose-lg max-w-none;
    @apply prose-headings:scroll-mt-20;
    @apply prose-code:before:content-none prose-code:after:content-none;
    @apply prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded;
  }
}
```

## Theme Customization

### Component Variants

```typescript
/**
 * Component variant patterns with Tailwind CSS.
 * 
 * @remarks
 * Demonstrates systematic approach to component styling
 * using class-variance-authority and Tailwind utilities.
 */

// lib/styles/variants.ts
import { cva } from 'class-variance-authority'

/**
 * Button variant configuration with comprehensive styling.
 * 
 * @example Button variants
 * ```typescript
 * <Button variant="primary" size="lg">Primary Action</Button>
 * <Button variant="outline" size="sm">Secondary Action</Button>
 * <Button variant="ghost" size="icon">
 *   <Icon className="h-4 w-4" />
 * </Button>
 * ```
 */
export const buttonVariants = cva(
  [
    'btn-base',
    'whitespace-nowrap',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    '[&_svg:not([class*="size-"])]:size-4'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground shadow-sm',
          'hover:bg-primary/90',
          'focus-visible:ring-primary/50'
        ],
        destructive: [
          'bg-destructive text-destructive-foreground shadow-sm',
          'hover:bg-destructive/90',
          'focus-visible:ring-destructive/50'
        ],
        outline: [
          'border border-input bg-background shadow-sm',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-primary/50'
        ],
        secondary: [
          'bg-secondary text-secondary-foreground shadow-sm',
          'hover:bg-secondary/80',
          'focus-visible:ring-secondary/50'
        ],
        ghost: [
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-accent/50'
        ],
        link: [
          'text-primary underline-offset-4',
          'hover:underline',
          'focus-visible:ring-primary/50'
        ]
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

/**
 * Card variant configuration for different contexts.
 */
export const cardVariants = cva(
  'card-base',
  {
    variants: {
      variant: {
        default: '',
        outline: 'border-2',
        filled: 'bg-muted/50',
        elevated: 'shadow-lg'
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default'
    }
  }
)

/**
 * Badge variant configuration for status indicators.
 */
export const badgeVariants = cva(
  [
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
    'ring-1 ring-inset transition-colors'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary/10 text-primary',
          'ring-primary/20'
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'ring-secondary/20'
        ],
        destructive: [
          'bg-destructive/10 text-destructive',
          'ring-destructive/20'
        ],
        success: [
          'bg-success/10 text-success',
          'ring-success/20'
        ],
        warning: [
          'bg-warning/10 text-warning',
          'ring-warning/20'
        ],
        outline: [
          'text-foreground',
          'ring-border'
        ]
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

/**
 * Alert variant configuration for notifications.
 */
export const alertVariants = cva(
  [
    'relative w-full rounded-lg border px-4 py-3 text-sm',
    '[&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
    '[&>svg]:text-foreground [&>svg~*]:pl-7'
  ],
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: [
          'border-destructive/50 text-destructive',
          'dark:border-destructive [&>svg]:text-destructive'
        ],
        success: [
          'border-success/50 text-success',
          'dark:border-success [&>svg]:text-success'
        ],
        warning: [
          'border-warning/50 text-warning',
          'dark:border-warning [&>svg]:text-warning'
        ]
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)
```

### Responsive Design Patterns

```typescript
/**
 * Responsive design patterns using Tailwind CSS breakpoints.
 * 
 * @remarks
 * Demonstrates mobile-first responsive design with systematic
 * breakpoint usage and component adaptation patterns.
 */

// components/responsive/grid-layout.tsx
import { cn } from '@/lib/utils'

interface GridLayoutProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly columns?: {
    readonly sm?: number
    readonly md?: number
    readonly lg?: number
    readonly xl?: number
  }
  readonly gap?: 'sm' | 'md' | 'lg'
}

/**
 * Responsive grid layout component.
 * 
 * @param props - Grid layout properties
 * @returns Responsive grid with configurable columns and gap
 * 
 * @example Responsive course grid
 * ```typescript
 * <GridLayout 
 *   columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} 
 *   gap="lg"
 * >
 *   {courses.map(course => (
 *     <CourseCard key={course.id} course={course} />
 *   ))}
 * </GridLayout>
 * ```
 */
export function GridLayout({ 
  children, 
  className, 
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 'md' 
}: GridLayoutProps) {
  const gridClasses = cn(
    'grid w-full',
    // Grid columns
    columns.sm && `grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    // Gap sizing
    gap === 'sm' && 'gap-4',
    gap === 'md' && 'gap-6',
    gap === 'lg' && 'gap-8',
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

/**
 * Responsive container component with max-width constraints.
 */
interface ContainerProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  readonly padding?: boolean
}

export function Container({ 
  children, 
  className, 
  size = 'lg',
  padding = true 
}: ContainerProps) {
  const containerClasses = cn(
    'mx-auto w-full',
    // Size variants
    size === 'sm' && 'max-w-2xl',
    size === 'md' && 'max-w-4xl',
    size === 'lg' && 'max-w-6xl',
    size === 'xl' && 'max-w-7xl',
    size === 'full' && 'max-w-full',
    // Responsive padding
    padding && 'px-4 sm:px-6 lg:px-8',
    className
  )

  return (
    <div className={containerClasses}>
      {children}
    </div>
  )
}

/**
 * Responsive typography component with fluid scaling.
 */
interface ResponsiveTextProps {
  readonly children: React.ReactNode
  readonly as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  readonly size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  readonly weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  readonly className?: string
}

export function ResponsiveText({ 
  children, 
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  className 
}: ResponsiveTextProps) {
  const textClasses = cn(
    // Base responsive typography
    size === 'xs' && 'text-xs sm:text-sm',
    size === 'sm' && 'text-sm sm:text-base',
    size === 'base' && 'text-base sm:text-lg',
    size === 'lg' && 'text-lg sm:text-xl',
    size === 'xl' && 'text-xl sm:text-2xl',
    size === '2xl' && 'text-2xl sm:text-3xl',
    size === '3xl' && 'text-3xl sm:text-4xl lg:text-5xl',
    size === '4xl' && 'text-4xl sm:text-5xl lg:text-6xl',
    // Font weights
    weight === 'normal' && 'font-normal',
    weight === 'medium' && 'font-medium',
    weight === 'semibold' && 'font-semibold',
    weight === 'bold' && 'font-bold',
    className
  )

  return (
    <Component className={textClasses}>
      {children}
    </Component>
  )
}
```

## Dark Mode Implementation

### Theme Toggle System

```typescript
/**
 * Dark mode implementation with system preference detection.
 * 
 * @remarks
 * Provides seamless dark mode switching with persistence,
 * system preference detection, and smooth transitions.
 */

// components/theme/theme-provider.tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

/**
 * Theme provider component with dark mode support.
 * 
 * @param props - Theme provider properties
 * @returns Theme context provider
 * 
 * @example Root layout integration
 * ```typescript
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <body>
 *         <ThemeProvider
 *           attribute="class"
 *           defaultTheme="system"
 *           enableSystem
 *           disableTransitionOnChange
 *         >
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// components/theme/theme-toggle.tsx
'use client'

import * as React from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * Theme toggle component with dropdown options.
 * 
 * @returns Theme selection dropdown with icons
 * 
 * @example Theme toggle in header
 * ```typescript
 * export function Header() {
 *   return (
 *     <header className="border-b">
 *       <div className="container flex items-center justify-between py-4">
 *         <Logo />
 *         <div className="flex items-center gap-4">
 *           <Navigation />
 *           <ThemeToggle />
 *         </div>
 *       </div>
 *     </header>
 *   )
 * }
 * ```
 */
export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <SunIcon className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <MoonIcon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <span className="mr-2 h-4 w-4">🖥️</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Hook for theme-aware styling.
 * 
 * @returns Theme utilities and state
 */
export function useThemeAware() {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const isLight = mounted && resolvedTheme === 'light'
  const isSystem = theme === 'system'

  return {
    theme,
    systemTheme,
    resolvedTheme,
    isDark,
    isLight,
    isSystem,
    mounted
  }
}
```

## Animation and Transitions

### Custom Animations

```css
/**
 * Custom animations using CSS @keyframes and Tailwind utilities.
 * 
 * @remarks
 * Provides smooth animations for loading states, page transitions,
 * and interactive feedback with performance optimization.
 */

/* Custom animations in globals.css */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slide-in-from-top {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-in-from-bottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-in-from-left {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-in-from-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scale-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.95);
    opacity: 0;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
}

/* Animation utility classes */
@layer utilities {
  .animate-fade-in {
    animation: fade-in var(--duration-normal) ease-out;
  }
  
  .animate-fade-out {
    animation: fade-out var(--duration-fast) ease-in;
  }
  
  .animate-slide-in-from-top {
    animation: slide-in-from-top var(--duration-normal) ease-out;
  }
  
  .animate-slide-in-from-bottom {
    animation: slide-in-from-bottom var(--duration-normal) ease-out;
  }
  
  .animate-slide-in-from-left {
    animation: slide-in-from-left var(--duration-normal) ease-out;
  }
  
  .animate-slide-in-from-right {
    animation: slide-in-from-right var(--duration-normal) ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in var(--duration-normal) ease-out;
  }
  
  .animate-scale-out {
    animation: scale-out var(--duration-fast) ease-in;
  }
  
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
  
  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
}

/* Page transition animations */
@layer components {
  .page-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity var(--duration-normal) ease-out,
                transform var(--duration-normal) ease-out;
  }
  
  .page-exit {
    opacity: 1;
    transform: translateY(0);
  }
  
  .page-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity var(--duration-fast) ease-in,
                transform var(--duration-fast) ease-in;
  }
}
```

### Loading States

```typescript
/**
 * Loading state components with Tailwind animations.
 * 
 * @remarks
 * Provides consistent loading indicators with smooth animations
 * and accessibility considerations.
 */

// components/ui/loading.tsx
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  readonly size?: 'sm' | 'md' | 'lg'
  readonly className?: string
}

/**
 * Loading spinner component with size variants.
 * 
 * @param props - Spinner properties
 * @returns Animated loading spinner
 * 
 * @example Loading button state
 * ```typescript
 * <Button disabled={loading}>
 *   {loading && <LoadingSpinner size="sm" className="mr-2" />}
 *   {loading ? 'Saving...' : 'Save Changes'}
 * </Button>
 * ```
 */
export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        size === 'sm' && 'h-4 w-4',
        size === 'md' && 'h-6 w-6',
        size === 'lg' && 'h-8 w-8',
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Skeleton loading component for content placeholders.
 */
interface SkeletonProps {
  readonly className?: string
  readonly variant?: 'text' | 'circular' | 'rectangular'
  readonly lines?: number
}

export function Skeleton({ className, variant = 'rectangular', lines = 1 }: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 animate-pulse rounded bg-muted',
              i === lines - 1 && 'w-3/4', // Last line shorter
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'circular' && 'h-12 w-12 rounded-full',
        variant === 'rectangular' && 'h-4 w-full rounded',
        className
      )}
    />
  )
}

/**
 * Loading dots component for inline loading states.
 */
export function LoadingDots({ className }: { readonly className?: string }) {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
    </div>
  )
}

/**
 * Progress bar component for loading progress.
 */
interface ProgressBarProps {
  readonly value: number
  readonly max?: number
  readonly className?: string
  readonly showLabel?: boolean
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showLabel = false 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
```

## Performance Optimization

### CSS Optimization Patterns

```typescript
/**
 * Performance optimization patterns for Tailwind CSS.
 * 
 * @remarks
 * Demonstrates strategies for reducing CSS bundle size,
 * optimizing critical rendering path, and improving performance.
 */

// lib/styles/optimization.ts

/**
 * Critical CSS patterns for above-the-fold content.
 * 
 * @remarks
 * Classes that should be included in critical CSS for
 * first paint optimization.
 */
export const criticalClasses = [
  // Layout
  'flex', 'grid', 'block', 'inline-block', 'hidden',
  'w-full', 'h-full', 'min-h-screen',
  'container', 'mx-auto',
  
  // Typography
  'text-base', 'text-lg', 'text-xl', 'text-2xl',
  'font-normal', 'font-medium', 'font-semibold', 'font-bold',
  'text-foreground', 'text-muted-foreground',
  
  // Colors
  'bg-background', 'bg-card', 'bg-primary',
  'text-foreground', 'text-primary', 'text-destructive',
  'border-border', 'border-input',
  
  // Spacing
  'p-4', 'p-6', 'px-4', 'py-2', 'py-4',
  'm-0', 'mx-auto', 'mb-4', 'mt-8',
  'gap-2', 'gap-4', 'space-y-4',
  
  // Basic components
  'btn-base', 'card-base', 'input-base'
] as const

/**
 * Utility for conditional class application.
 * 
 * @param condition - Boolean condition
 * @param truthyClasses - Classes to apply when true
 * @param falsyClasses - Classes to apply when false
 * @returns Conditional classes string
 * 
 * @example Conditional styling
 * ```typescript
 * <div className={conditionalClasses(
 *   isActive,
 *   'bg-primary text-primary-foreground',
 *   'bg-muted text-muted-foreground'
 * )}>
 *   Status indicator
 * </div>
 * ```
 */
export function conditionalClasses(
  condition: boolean,
  truthyClasses: string,
  falsyClasses: string = ''
): string {
  return condition ? truthyClasses : falsyClasses
}

/**
 * Utility for responsive class generation.
 * 
 * @param base - Base classes
 * @param responsive - Responsive overrides
 * @returns Responsive classes string
 */
export function responsiveClasses(
  base: string,
  responsive: {
    readonly sm?: string
    readonly md?: string
    readonly lg?: string
    readonly xl?: string
  } = {}
): string {
  const classes = [base]
  
  if (responsive.sm) classes.push(`sm:${responsive.sm}`)
  if (responsive.md) classes.push(`md:${responsive.md}`)
  if (responsive.lg) classes.push(`lg:${responsive.lg}`)
  if (responsive.xl) classes.push(`xl:${responsive.xl}`)
  
  return classes.join(' ')
}

/**
 * Component class factory for consistent styling.
 * 
 * @param baseClasses - Base component classes
 * @param variants - Available style variants
 * @returns Class factory function
 */
export function createComponentClasses<T extends Record<string, string>>(
  baseClasses: string,
  variants: T
) {
  return (variant: keyof T = 'default' as keyof T, additionalClasses?: string) => {
    return cn(baseClasses, variants[variant], additionalClasses)
  }
}

/**
 * Performance monitoring for CSS-in-JS alternatives.
 * 
 * @param componentName - Name for performance tracking
 * @param classNames - Classes being applied
 */
export function trackCSSPerformance(
  componentName: string,
  classNames: string
): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const classCount = classNames.split(' ').length
    
    if (classCount > 20) {
      console.warn(
        `Component "${componentName}" has ${classCount} classes. Consider optimization.`
      )
    }
  }
}
```

## Best Practices

### Design System Integration

```typescript
/**
 * Design system integration patterns with Tailwind CSS.
 * 
 * @remarks
 * Demonstrates systematic approach to maintaining design consistency
 * across the platform with reusable patterns and tokens.
 */

// lib/design-system/tokens.ts

/**
 * Design token definitions for consistent theming.
 * 
 * @remarks
 * Centralized design tokens that map to Tailwind CSS custom properties
 * for maintainable and consistent design system implementation.
 */
export const designTokens = {
  colors: {
    brand: {
      primary: 'oklch(50.4% 0.146 258.7)',
      secondary: 'oklch(93.7% 0.008 258.7)',
      accent: 'oklch(95.3% 0.013 258.7)'
    },
    semantic: {
      success: 'oklch(70.2% 0.13 142.1)',
      warning: 'oklch(78.9% 0.13 71.3)',
      error: 'oklch(64.8% 0.15 23.1)',
      info: 'oklch(67.5% 0.146 258.7)'
    },
    neutral: {
      50: 'oklch(99% 0.002 258.7)',
      100: 'oklch(97% 0.004 258.7)',
      200: 'oklch(93% 0.008 258.7)',
      300: 'oklch(87% 0.012 258.7)',
      400: 'oklch(75% 0.018 258.7)',
      500: 'oklch(63% 0.024 258.7)',
      600: 'oklch(51% 0.03 258.7)',
      700: 'oklch(39% 0.036 258.7)',
      800: 'oklch(27% 0.042 258.7)',
      900: 'oklch(15% 0.048 258.7)'
    }
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
} as const

/**
 * Component composition patterns for design system.
 */
export const componentPatterns = {
  // Interactive states
  interactive: [
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50'
  ].join(' '),
  
  // Card patterns
  card: [
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    'transition-shadow duration-200'
  ].join(' '),
  
  // Input patterns
  input: [
    'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1',
    'text-sm ring-offset-background transition-colors',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ].join(' '),
  
  // Layout patterns
  container: [
    'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'
  ].join(' '),
  
  // Typography patterns
  heading: [
    'scroll-mt-20 font-semibold tracking-tight'
  ].join(' '),
  
  // Content patterns
  prose: [
    'prose prose-neutral max-w-none',
    'prose-headings:scroll-mt-20 prose-headings:font-semibold',
    'prose-lead:text-muted-foreground',
    'prose-links:text-primary prose-links:underline-offset-4',
    'prose-strong:font-semibold prose-code:font-mono',
    'prose-pre:bg-muted prose-pre:text-muted-foreground',
    'prose-blockquote:border-l-border prose-blockquote:text-muted-foreground',
    'prose-hr:border-border'
  ].join(' ')
} as const

/**
 * Accessibility patterns for inclusive design.
 */
export const accessibilityPatterns = {
  // Skip navigation
  skipLink: [
    'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
    'z-50 rounded-md bg-background px-4 py-2 text-foreground',
    'ring-2 ring-ring ring-offset-2'
  ].join(' '),
  
  // Screen reader only content
  srOnly: 'sr-only',
  
  // Focus indicators
  focusVisible: [
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-ring focus-visible:ring-offset-2'
  ].join(' '),
  
  // High contrast support
  highContrast: [
    'forced-colors:border-[ButtonBorder]',
    'forced-colors:text-[ButtonText]'
  ].join(' ')
} as const

/**
 * Responsive design patterns for consistent breakpoint usage.
 */
export const responsivePatterns = {
  // Mobile-first grid
  gridResponsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  
  // Responsive text sizing
  textResponsive: {
    hero: 'text-4xl sm:text-5xl lg:text-6xl',
    heading: 'text-2xl sm:text-3xl lg:text-4xl',
    subheading: 'text-lg sm:text-xl lg:text-2xl',
    body: 'text-base sm:text-lg'
  },
  
  // Responsive spacing
  spacingResponsive: {
    section: 'py-12 sm:py-16 lg:py-20',
    container: 'px-4 sm:px-6 lg:px-8',
    gap: 'gap-4 sm:gap-6 lg:gap-8'
  }
} as const

export { designTokens, componentPatterns, accessibilityPatterns, responsivePatterns }
```

---

This comprehensive Tailwind CSS 4.1.12 integration guide demonstrates modern CSS-first configuration patterns, responsive design, dark mode implementation, and performance optimization for the NSBS Platform.