# System Patterns

## NSBS Platform Technical Patterns

### Architecture Patterns (Production-Grade)

#### **App Router First (Next.js 15.5.0)**

```typescript
// ✅ STANDARD: Server Components by default
export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourseData(params.slug) // Server-side data fetching
  return <CourseContent course={course} />
}

// ✅ STANDARD: Client components only when needed
'use client'
export function InteractiveExamInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  // Client-side interactivity only
}
```

#### **Development Environment Issues & Solutions**

##### **TypeScript ESLint Integration (8.41.0)**

**Configuration**: ESLint flat config with TypeScript ESLint meta package

- **Package**: `typescript-eslint@8.41.0` (exact version)
- **Configuration**: `eslint.config.js` (flat config format)
- **Project Service**: Enabled for type-aware linting
- **Ignores**: Config files excluded from type checking

**Key Features**:

- Type-aware linting with projectService: true
- Strict TypeScript rules with consistent type imports
- Custom className enforcement rules (cn() utility)
- Separate configurations for TS/TSX and JS/JSX files
- Proper file exclusions for config files

**Motion Package Migration**:

- **Old**: `framer-motion@12.23.12`
- **New**: `motion@12.23.12` (Motion package v12)
- **Import Pattern**: `import { motion } from "motion/react"` for client
  components
- **RSC Pattern**: `import * as motion from "motion/react-client"` for server
  components

**Import Organization Standards**:

- **Order**: External packages → Type imports → Internal modules
- **Grouping**: UI components, utilities, types, icons, hooks, local imports
- **Formatting**: Alphabetical sorting within groups, consistent naming
- **Example Pattern**:

```typescript
// ✅ STANDARD: Import organization with ESLint auto-sorting
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course, Lesson } from "@/lib/types"
import { BookOpen, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import MDXRenderer from "./mdx-renderer"
```

##### **Issue: Custom Element Already Defined (webcomponents-ce.js)**

```
Error: A custom element with name 'mce-autosize-textarea' has already been defined.
```

**Root Cause**: Browser extension (likely TinyMCE-related) or external script
defining custom elements multiple times during hot reload.

**Solutions**:

1. **Browser Extension Conflict**: Disable browser extensions during development
2. **External Scripts**: Check for TinyMCE or rich text editor scripts in
   browser network tab
3. **Development Only**: This error doesn't affect production builds
4. **Ignore in Development**: Add to known development issues list

**Prevention**:

```javascript
// If using custom elements, wrap in conditional
if (!customElements.get("my-element")) {
  customElements.define("my-element", MyElement)
}
```

##### **Issue: TailwindCSS v4 CSS Warnings in VS Code**

```
Unknown at rule @theme
Unknown at rule @apply
```

**Root Cause**: VS Code CSS language server doesn't recognize TailwindCSS v4
directives.

**Solutions**:

1. **VS Code Settings**: Created `.vscode/settings.json` with CSS validation
   disabled
2. **TailwindCSS Extension**: Recommended `bradlc.vscode-tailwindcss` extension
3. **CSS-First Configuration**: Removed legacy theme config from
   `tailwind.config.ts`
4. **PostCSS Integration**: Confirmed `@tailwindcss/postcss` plugin is properly
   configured

**Files Fixed**:

- `app/globals.css`: Changed `@theme inline` to `@theme`
- `tailwind.config.ts`: Simplified to v4 CSS-first approach
- `.vscode/settings.json`: Disabled CSS validation warnings
- `.vscode/extensions.json`: Recommended TailwindCSS extension

##### **Issue: Missing Favicon (404)**

**Solution**: Added favicon.svg and favicon.ico to /public directory

- Favicon.svg: NSBS-branded SVG with evergreen/mint-sage colors
- Favicon.ico: Fallback for older browsers

#### **TypeScript Maximum Strictness**

```json
// tsconfig.json - Production configuration
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true
  }
}
```

#### **Zod v4 Validation Pattern**

```typescript
// ✅ STANDARD: v4 patterns only
import * as z from "zod"

const UserSchema = z.strictObject({
  email: z.email(), // Top-level validator
  name: z.string().min(1),
  role: z.enum(["admin", "user"]),
})

// ✅ STANDARD: v4 error handling
const result = UserSchema.safeParse(data)
if (!result.success) {
  return { error: z.treeifyError(result.error) }
}
```

### Authentication Pattern (Enhanced)

- **Provider:** Supabase Auth with enhanced security
- **Methods:** Google OAuth + Email Magic Link with rate limiting
- **Session Management:** Server-side with secure cookie handling
- **Route Protection:** Middleware-based auth checks with RLS integration
- **Rate Limiting:** Auth endpoint protection (10 attempts/5 minutes)

### Data Access Pattern (Optimized)

- **SSOT:** File-system based course metadata with ISR caching
- **Database:** Supabase with enhanced RLS policies and helper functions
- **Content:** MDX files with caching layer for performance
- **Validation:** Zod v4 schemas with strict typing and error handling
- **Caching:** Course data (24h), User progress (1h), API responses (5min)

### Payment Pattern (Secured)

- **Provider:** Stripe 18.4.0 with rate limiting protection
- **Mode:** One-time payments with purchase flow rate limiting
- **Webhook:** Enhanced signature verification + order fulfillment
- **Price Source:** stripePriceId from cached course metadata
- **Rate Limiting:** Purchase endpoints (5 attempts/10 minutes)

### Email Pattern (Enhanced)

- **Provider:** Resend 6.0.1 with retry logic and rate limiting
- **From:** admin@nsbs-certified.com with validation
- **Templates:** Enhanced with v4 validation schemas
- **Triggers:** Webhook fulfillment, exam completion, admin actions
- **Rate Limiting:** Email sending (5 emails/minute)
- **Retry Logic:** Exponential backoff for failed sends

### UI/UX Patterns (Optimized)

- **Components:** Radix UI with dynamic imports and code splitting
- **Styling:** Tailwind CSS v4 with design tokens and critical CSS
- **Colors:** Mint Sage, Mocha Mousse, Evergreen (NO BLUE)
- **Accessibility:** WCAG 2.2 AA compliance, keyboard navigation
- **Motion:** Respect prefers-reduced-motion with performance optimizations
- **Loading:** Smart loading states with skeleton components

### Progress Tracking Pattern (Cached)

- **Lesson Level:** Manual confirmation with progress caching
- **Course Level:** Cached aggregate progress (1h TTL)
- **Exam Level:** Rate-limited attempt tracking (max 2 attempts)
- **Audit Trail:** Enhanced event records with performance monitoring

### Rate Limiting Patterns

#### API Endpoints

- **General API:** 100 requests/minute
- **Authentication:** 10 attempts/5 minutes
- **Email Sending:** 5 emails/minute
- **Purchase Flow:** 5 attempts/10 minutes
- **Exam Taking:** 3 attempts/hour
- **Verification:** 20 requests/minute

#### Implementation

```typescript
// Rate limiting middleware with configurable presets
import { rateLimit } from "@/lib/rate-limiting"

export const rateLimiters = {
  api: rateLimit({ maxRequests: 100, windowMs: 60000 }),
  auth: rateLimit({ maxRequests: 10, windowMs: 300000 }),
  email: rateLimit({ maxRequests: 5, windowMs: 60000 }),
  // ... other presets
}
```

### Caching Patterns

#### Cache Hierarchy

1. **In-Memory Cache:** Development + fallback (5-minute TTL)
2. **Redis Cache:** Production primary (configurable TTL)
3. **ISR Cache:** Static page regeneration (1-hour revalidation)
4. **Browser Cache:** Static assets (1-year immutable)

#### Cache Keys

```typescript
// Namespaced cache keys with versioning
nsbs:courses:course-slug:v1.0
nsbs:progress:user-id:course-slug:v1.0
nsbs:api:endpoint-key:v1.0
```

### Security Patterns (Enhanced)

#### Row Level Security

- **User Access:** Own data only (purchases, progress, certificates)
- **Admin Access:** All data with audit logging
- **Public Access:** Certificate verification only
- **Function Security:** Helper functions for access control

#### Rate Limiting Security

- **IP-based limits:** Prevent abuse from single sources
- **User-based limits:** Prevent account-based abuse
- **Endpoint-specific:** Tailored protection for sensitive operations
- **Bypass mechanisms:** Admin override with logging

#### Content Security (MDX Rendering)

**NEVER USE `dangerouslySetInnerHTML`** - Creates XSS vulnerabilities

```typescript
// ❌ DANGEROUS: Bypasses React's XSS protection
<div dangerouslySetInnerHTML={{ __html: content }} />

// ✅ SECURE: Proper MDX rendering with next-mdx-remote
import { MDXRemote } from "next-mdx-remote/rsc"
import { serialize } from "next-mdx-remote/serialize"

const mdxComponents = {
  h1: ({ children }) => <h1 className="text-3xl font-bold">{children}</h1>,
  // Custom educational components
  LearningObjective: ({ children }) => (
    <Card className="border-primary/20">
      <Badge variant="default">Learning Objective</Badge>
      {children}
    </Card>
  ),
}

export default function MDXRenderer({ content }) {
  const serializedContent = useMemo(async () => {
    return await serialize(content, {
      mdxOptions: { development: process.env.NODE_ENV === 'development' }
    })
  }, [content])
  
  return <MDXRemote {...serializedContent} components={mdxComponents} />
}
```

**Security Benefits**:
- No XSS vulnerabilities through content injection
- React's built-in sanitization and escaping
- Type-safe component mapping
- Proper error boundaries and fallbacks

### Bundle Optimization Patterns

#### Code Splitting

- **Route-based:** Separate chunks for admin, dashboard, auth
- **Component-based:** Dynamic imports for heavy components
- **Feature-based:** Conditional loading with feature flags
- **Vendor-based:** Separate vendor bundles for core libraries

#### Performance Monitoring

```typescript
// Bundle performance tracking
export class BundlePerformanceMonitor {
  static startTiming(componentName: string): number
  static endTiming(componentName: string): number
  static getAverageLoadTime(): number
}
```

### Error Handling Patterns

#### Validation Errors

- **Zod v4:** Tree-structured error messages
- **Type Safety:** Compile-time validation with strict TypeScript
- **User Feedback:** Friendly error messages with specific guidance

#### Rate Limiting Errors

- **429 Responses:** Clear rate limit exceeded messages
- **Retry Headers:** Retry-After headers for client guidance
- **Graceful Degradation:** Fallback experiences when rate limited

#### Cache Errors

- **Fallback Strategy:** Automatic in-memory cache fallback
- **Error Recovery:** Graceful handling of cache service failures
- **Performance Monitoring:** Track cache hit/miss rates

## Architecture Quality Metrics

- **Type Safety:** 9.0/10 (enhanced TypeScript strictness)
- **Security:** 8.5/10 (rate limiting + enhanced RLS)
- **Performance:** 8.0/10 (caching + ISR + optimization)
- **Scalability:** 8.0/10 (Redis-ready + bundle optimization)
- **Maintainability:** 9.0/10 (modern patterns + documentation)
- **Reliability:** 8.5/10 (retry logic + error handling)
