# Decision Log

## NSBS Platform Technical Decisions

### **August 27, 2025 - TypeScript ESLint Integration & Motion Package Migration**

#### **Decision #016: TypeScript ESLint 8.41.0 Migration**

**Status**: ✅ Implemented  
**Impact**: High - Modernizes linting infrastructure with type-aware rules

**Decision**: Migrated from legacy ESLint configuration to TypeScript ESLint
flat config

- **Package**: `typescript-eslint@8.41.0` (exact version pin per SSOT)
- **Config Format**: Legacy `.eslintrc.js` → Flat `eslint.config.js`
- **Type Awareness**: Enabled projectService for type-aware linting
- **File Separation**: Separate configs for TypeScript and JavaScript files
- **Exclusions**: Config files excluded from type checking to prevent parsing
  errors

**Technical Implementation**:

- Project Service integration for editor alignment
- Custom className enforcement rules preserved
- Strict TypeScript typing with consistent import patterns
- JavaScript files get basic linting without type checking

**Rationale**: TypeScript ESLint 8.41.0 provides better performance, editor
integration, and type-aware linting while following current best practices for
flat config.

**Files Modified**: `eslint.config.js` (new), `package.json`, removed
`.eslintrc.js`

---

#### **Decision #017: Motion Package Migration (Framer Motion → Motion)**

**Status**: ✅ Implemented  
**Impact**: Medium - Future-proofs animation library usage

**Decision**: Migrated from Framer Motion to Motion package v12.23.12

- **Package Change**: `framer-motion@12.23.12` → `motion@12.23.12`
- **Import Pattern**: `import { motion } from "motion/react"` for client
  components
- **RSC Support**: `import * as motion from "motion/react-client"` for server
  components
- **Documentation**: Updated README.md, website.md to reflect new package

---

#### **Decision #019: MDX Renderer Security Fix**

**Status**: ✅ Implemented  
**Impact**: Critical - Eliminates XSS vulnerability in content rendering

**Decision**: Replaced dangerous `dangerouslySetInnerHTML` with secure MDX implementation

- **Security Risk**: Removed `dangerouslySetInnerHTML` which bypassed React's XSS protections
- **Implementation**: Full MDX renderer with `next-mdx-remote` and custom components
- **Components**: Tailwind-styled MDX components for consistent UI/UX
- **Error Handling**: Proper MDX serialization error handling and fallbacks
- **Learning Features**: Custom components (LearningObjective, KeyConcept, Example)

**Technical Implementation**:
- `next-mdx-remote/rsc` for React Server Component support
- Async serialization with proper error boundaries
- Custom component mapping for enhanced educational content
- Scope passing for course/lesson context

**Rationale**: `dangerouslySetInnerHTML` creates serious XSS vulnerabilities and breaks React's security model. Proper MDX rendering provides security, better performance, and enhanced educational features.

**Files Modified**: `components/course/mdx-renderer.tsx` (complete rewrite)

**Rationale**: Motion package is the official evolution of Framer Motion with
better React Server Component support and performance optimizations for Next.js
App Router.

**Files Modified**: `package.json`, `README.md`, `website.md`

---

#### **Decision #018: Import Organization & Code Formatting Standards**

**Status**: ✅ Implemented  
**Impact**: Medium - Improves code consistency and maintainability

**Decision**: Applied consistent import organization and formatting across
components

- **Import Order**: External packages → Type imports → Internal modules → Local
  imports
- **Grouping**: UI components, utilities, types, icons, hooks grouped logically
- **Auto-sorting**: ESLint rules enforce alphabetical sorting within groups
- **Type Imports**: Consistent use of `import type` for TypeScript types

**Implementation**:

- Updated study-interface.tsx with proper import organization
- Applied ESLint auto-formatting rules consistently
- Maintained component functionality while improving readability

**Rationale**: Consistent import organization improves code readability, reduces
merge conflicts, and follows TypeScript ESLint best practices for maintainable
codebases.

**Files Modified**: `components/course/study-interface.tsx`

---

### **August 25, 2025 - Code Quality & Performance Optimization**

#### **Decision #015: Prettier Configuration Optimization**

**Status**: ✅ Implemented  
**Impact**: High - Standardizes code formatting across entire codebase

**Decision**: Optimized Prettier configuration tailored to our codebase patterns

- **Changed**: `printWidth: 80 → 100` (modern monitors, fewer line breaks)
- **Changed**: `singleQuote: true → false` (matches TypeScript/JSX convention)
- **Changed**: `semi: true → false` (consistent with codebase pattern)
- **Added**: File-specific overrides for Markdown (80), JSON (120), YAML (120)
- **Added**: Prose wrapping for documentation files

**Rationale**: Analysis showed codebase consistently uses double quotes, no
semicolons, and longer lines would improve readability while maintaining git
diff quality.

**Files Modified**: `.prettierrc`

---

#### **Decision #014: Duplicate File Cleanup Complete**

**Status**: ✅ Implemented  
**Impact**: High - Eliminates confusion and maintains clean repository

**Decision**: Removed all duplicate files with suffixes like "enhanced", "v4",
"new"

- **Removed**: `lib/supabase-enhanced.ts` (functionality merged into original)
- **Removed**: `lib/validation-v4.ts` (functionality merged into original)
- **Removed**: `components/ui/tooltip-new.tsx` (duplicate functionality)
- **Removed**: All backup and versioned files

**Rationale**: Using Git for version control eliminates need for duplicate
files. Clean repository structure improves maintainability and reduces
confusion.

---

#### **Decision #013: Production-Grade Performance Optimization**

**Status**: ✅ Implemented  
**Impact**: High - Enables scale and improves user experience

**Decision**: Implemented comprehensive performance optimization framework

- **Added**: ISR (Incremental Static Regeneration) for course pages
- **Added**: Multi-tier caching system with Redis preparation
- **Added**: Bundle optimization with code splitting
- **Added**: Dynamic imports for large components
- **Modified**: Next.js configuration for production optimization

**Rationale**: Performance is critical for professional platform credibility.
ISR reduces server load while maintaining fresh content. Caching improves
response times.

**Files Created**: `lib/cache.ts`, `lib/isr-utils.ts`,
`lib/bundle-optimization.tsx` **Files Modified**: `next.config.mjs`

## Component Implementation

### CI-001: React-Tooltip Implementation

**Date:** 2025-08-21  
**Context:** Replace non-existent @radix-ui/react-tooltip with working
solution  
**Issue:** Tooltip component was importing from @radix-ui/react-tooltip which
doesn't exist in Radix UI library  
**Solution:** Implemented react-tooltip library (react-tooltip.com)  
**Technical Details:**

1. Installed react-tooltip package
2. Created new Tooltip component using data attributes pattern
3. Added SidebarTooltipWrapper for legacy compatibility with existing sidebar
   usage
4. Maintained backwards compatibility with TooltipProvider, TooltipTrigger,
   TooltipContent exports
5. Added styling variants (dark, light) with TailwindCSS classes **Benefits:**
   Working tooltips, proper TypeScript support, lighter bundle (no unnecessary
   Radix dependency)  
   **Architecture Impact:** Switched from Radix compound component pattern to
   data-attribute pattern

## Build System Resolution

### BS-001: Systematic Build Error Resolution

**Date:** 2025-01-20  
**Context:** "Parsing ecmascript source code failed" targeting
tailwind.config.ts line 138  
**Root Cause:** Missing Radix UI dependencies + server/client component
conflicts  
**Resolution:** Multi-phase systematic approach through Opus Mode analysis  
**Actions Taken:**

1. Added 7 missing Radix UI packages (@radix-ui/react-alert-dialog, react-label,
   react-progress, react-radio-group, react-select, react-separator, react-tabs)
2. Created lib/supabase-client.ts for client-side components
3. Modernized Next.js configuration (typedRoutes: experimental→stable)
4. Enhanced type safety (removed Record<string, any>)
5. Fixed TailwindCSS v4 import syntax (single→double quotes) **Outcome:** ✅
   Build system restored, dev server running successfully  
   **Architecture Impact:** Established dual Supabase client/server pattern for
   SSR/CSR separation

## Architectural Decisions

### AD-001: Next.js App Router Architecture

**Date:** 2025-01-19  
**Decision:** Use Next.js 15 App Router exclusively, no /src directory, no
pages/api  
**Rationale:** Modern React patterns, better performance, cleaner file
structure  
**Impact:** All routes in /app directory, server components by default

### AD-002: Authentication Strategy

**Date:** 2025-01-19  
**Decision:** Supabase Auth with Google OAuth + Email Magic Link only  
**Rationale:** User requirement for specific auth methods, security best
practices  
**Impact:** No other auth providers allowed, simplified auth flow

### AD-003: Payment Architecture

**Date:** 2025-01-19  
**Decision:** Stripe one-time payments only, no subscriptions/bundles  
**Rationale:** Business model focused on individual course purchases  
**Impact:** Simplified pricing model, no recurring billing complexity

### AD-004: Color Palette Restriction

**Date:** 2025-01-19  
**Decision:** Strict prohibition of blue colors, use Mint Sage/Mocha
Mousse/Evergreen  
**Rationale:** Brand differentiation and specific design requirements  
**Impact:** All UI components must use approved color palette

### AD-005: Content Management Strategy

**Date:** 2025-01-19  
**Decision:** File-system based SSOT with data/courses/<slug>/course/meta.json  
**Rationale:** Version control, simplicity, build-time optimization  
**Impact:** No CMS needed, content managed through repository

### AD-006: Exam Policy

**Date:** 2025-01-19  
**Decision:** 2 attempts maximum, 85% pass score, timed sessions  
**Rationale:** Educational standards and certification integrity  
**Impact:** Strict exam enforcement, attempt tracking required

### AD-007: Development Environment Error Handling

**Date:** 2025-08-26  
**Decision:** Document and ignore browser extension conflicts
(mce-autosize-textarea)  
**Rationale:** External browser extensions causing custom element redefinition
errors  
**Impact:** Development-only issue, does not affect production builds  
**Solution:** Added favicon.svg/ico, documented webcomponents conflict as known
issue

### AD-019: Critical Security Fix - MDX Renderer

**Date:** 2025-08-26  
**Status:** APPROVED ✅  
**Context:** MDX renderer was using dangerouslySetInnerHTML causing XSS vulnerability  
**Decision:** Replace unsafe HTML rendering with proper MDX serialization using next-mdx-remote  
**Rationale:** Eliminate security vulnerability and implement React-safe content rendering  
**Impact:** Secure MDX content rendering with custom component support  
**Implementation:** 
  - Removed dangerouslySetInnerHTML completely
  - Implemented proper MDX serialization with next-mdx-remote/serialize
  - Added custom MDX components for enhanced learning content
  - Maintained all props for backward compatibility
