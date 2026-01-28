# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
yarn dev              # Start Next.js dev server (http://localhost:3000)

# Building
yarn build            # Production build (runs sitemap generation after)
yarn start            # Start production server

# Type Checking & Linting
yarn typecheck        # TypeScript type checking
yarn lint             # Run ESLint
yarn lint:fix         # Auto-fix ESLint issues + format code
yarn lint:strict      # ESLint with max 1 warning (for CI)

# Testing
yarn test             # Run Jest tests
yarn test:watch       # Jest in watch mode

# Formatting
yarn format           # Format code with Prettier
yarn format:check     # Check formatting without modifying
```

## Tech Stack & Architecture

This is a Next.js 14 e-commerce application for a watch/clothing collections store.

**Core Technologies:**

-   Next.js 14 (Pages Router) with TypeScript
-   Tailwind CSS with custom design system
-   React Query (@tanstack/react-query) for server state
-   Zustand with Immer for client state
-   next-i18next for internationalization

**E-commerce:**

-   WooCommerce REST API integration via `@woocommerce/woocommerce-rest-api`
-   Custom API wrapper with Bearer token auth (auto-refresh on 401)
-   Product filtering with complex state management

**Other Notable Libraries:**

-   GSAP with ScrollTrigger for scroll animations
-   React Hook Form + Yup for forms
-   Framer Motion for animations
-   Chart.js for price charts
-   Headless UI for modals/dialogs

## Project Structure

```
src/
├── api/              # API endpoints (if any)
├── components/       # Reusable UI components
├── modules/          # Feature-based modules (Home, Collections, Articles, etc.)
├── pages/            # Next.js pages routing
├── hooks/            # Custom React hooks
├── store/            # Zustand stores (client state)
├── contexts/         # React contexts (theme)
├── lib/              # Utilities, API wrapper, helpers
├── utils/            # Utility functions
├── constant/         # Constants and configuration
├── types/            # TypeScript type definitions
├── helpers/          # Helper functions
├── hoc/              # Higher-order components
└── styles/           # Global styles
```

## Path Aliases

TypeScript paths are configured in `tsconfig.json`:

-   `@components/*` → `src/components/*`
-   `@modules/*` → `src/modules/*`
-   `@hooks/*` → `src/hooks/*`
-   `@store/*` → `src/store/*`
-   `@lib/*` → `src/lib/*`
-   `@utils/*` → `src/utils/*`
-   `@types/*` → `src/types/*`
-   etc.

## State Management

**Client State (Zustand):**
Located in `src/store/`. Uses a specific pattern:

-   Base store created with `create()`, wrapped with `createSelectorHooks()` from `auto-zustand-selectors-hook`
-   Immer's `produce()` for immutable updates
-   Persist middleware for stores that need localStorage persistence

Example pattern from `src/store/useCollectionsFilterStore.tsx`:

```tsx
const useStoreBase = create<State>()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    { name: 'storage-key', partialize: (state) => ({ ... }) }
  )
)
const useStore = createSelectorHooks(useStoreBase)
```

**Server State (React Query):**

-   QueryClientProvider wraps the app in `_app.tsx`
-   HydrationBoundary for SSR dehydration
-   Use React Query devtools in development

## API Integration

**WooCommerce REST API:**

-   Primary instance in `src/lib/api.ts` via `createWooCommerceInstance()`
-   Uses Basic auth with base64-encoded consumer key/secret
-   Custom fetch wrapper in same file for Bearer token endpoints

**Authentication:**

-   Token stored via `@utils/auth` (getAuth, resetAuth)
-   Auto-logout on 401 response

## Module Architecture

Each module in `src/modules/` is self-contained with:

-   `index.ts` - Module exports
-   Main component/page file (e.g., `Collections.tsx`)
-   `components/` - Module-specific components

Example: `src/modules/Collections/` contains the collections page with sidebar filtering, mobile filter modal, product cards, etc.

## Important Patterns

**SVG Handling:**

-   SVGR webpack config in `next.config.js`
-   SVGs can be imported as components: `import Icon from '@svg/icon.svg'`
-   SVOGO plugins preserve viewBox and prevent ID cleanup

**Internationalization:**

-   `next-i18next` configured in `next-i18next.config.js`
-   Use `useTranslation()` hook in components
-   Translation files expected in `public/locales/`

**GSAP Animations:**

-   Registered in `_app.tsx` for client-side only
-   ScrollTrigger plugin registered alongside GSAP
-   Use with `@gsap/react` helper hook

**Dark Mode:**

-   Theme context in `src/contexts/ThemeContext.tsx`
-   Uses CSS custom properties
-   `dark:` Tailwind classes for dark mode styles

## Git Workflow

-   Husky pre-commit hooks run lint-staged
-   Commitlint enforces conventional commit messages
-   Pre-commit: ESLint (max 0 warnings) + Prettier on staged files

## Main Branch

The main branch for PRs is `pages-directory` (check git status to confirm current branch).
