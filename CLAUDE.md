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

# E2E Testing (Playwright)
# Playwright MCP tools are available for browser testing
# Use mcp__playwright__browser_* tools to navigate, click, and test UI

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

-   `@api/*` → `src/api/*`
-   `@components/*` → `src/components/*`
-   `@constant/*` → `src/constant/*`
-   `@contexts/*` → `src/contexts/*`
-   `@helpers/*` → `src/helpers/*`
-   `@hoc/*` → `src/hoc/*`
-   `@hooks/*` → `src/hooks/*`
-   `@lib/*` → `src/lib/*`
-   `@modules/*` → `src/modules/*`
-   `@pages/*` → `src/pages/*`
-   `@store/*` → `src/store/*`
-   `@styles/*` → `src/styles/*`
-   `@svg/*` → `src/svg/*`
-   `@types/*` → `src/types/*`
-   `@utils/*` → `src/utils/*`

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
-   **Shared filter logic**: Use `buildProductFiltersQuery(filters)` from `@hooks/useProduct` for consistent filter handling across components

**Authentication:**

-   Token stored via `@utils/auth` (getAuth, resetAuth)
-   Auto-logout on 401 response

**Product Filter System:**

Filters are managed through:

-   `src/store/useCollectionsFilterStore.tsx` - Zustand store with `FilterOptions` type
-   `src/hooks/useProduct.ts` - Exports `buildProductFiltersQuery()` shared function
-   `src/modules/Collections/Collections.tsx` - Uses shared query builder for filtering
-   `src/modules/Collections/components/Sidebar.tsx` - Desktop filter sidebar
-   `src/modules/Collections/components/MobileFilterModal.tsx` - Mobile filter modal

Filter options include: brands, availability, condition (brand-new, new-old-stock, pre-owned-\*), gender, priceRange, sortBy

**Important:** When updating router.query with `router.replace()`, always include `scroll: false` option to prevent unwanted scroll-to-top behavior during filter changes.

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

**External Images:**

-   Image domains must be whitelisted in `next.config.js` under `images.remotePatterns`
-   Currently whitelisted: `store.thewatchcollections.com`, `img.jakpost.net`, `*.cdninstagram.com`, `placehold.co`
-   Add new domains using the pattern: `{ protocol: 'https', hostname: 'your-domain.com' }`

**Internationalization:**

-   `next-i18next` configured in `next-i18next.config.js`
-   Use `useTranslation()` hook in components
-   Translation files expected in `public/locales/`

**GSAP Animations:**

-   Registered in `_app.tsx` for client-side only
-   ScrollTrigger plugin registered alongside GSAP
-   Use with `@gsap/react` helper hook

**NProgress Usage:**

-   Global NProgress is used in `_app.tsx` for route change loading only
-   **Do NOT reuse NProgress for component-specific progress indicators** - this causes conflicts
-   For article reading progress or similar scroll-based indicators, create custom DOM elements with z-index lower than 99999 to avoid conflicts with router NProgress
-   Always cleanup custom progress elements in useEffect return callback

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

## Git Flow Release Management

## Prerequisites

Install Git Flow if not already installed:

```bash
# macOS
brew install git-flow-avh

# Linux
sudo apt-get install git-flow

# Initialize git flow in repo (first time only)
git flow init
# Use default branch names: main (production), develop (development)
```

### Version Bumping Rules

| Change Type                         | Example       | Version Bump          |
| ----------------------------------- | ------------- | --------------------- |
| Bug fixes                           | 4.1.3 → 4.1.4 | Patch (last number)   |
| New features (backwards compatible) | 4.1.3 → 4.2.0 | Minor (middle number) |
| Breaking changes                    | 4.1.3 → 5.0.0 | Major (first number)  |

### Release Steps

1. Pre-release Checks

# Ensure develop branch is up to date

git checkout develop
git pull origin develop

# Check current version

# (Check your version file, e.g., package.json, version.ts, etc.)

2. Start Release Branch

# Replace X.Y.Z with the NEW version number

git flow release start X.Y.Z

# Example: git flow release start 4.1.4

3. Update Version

**Important:** Update BOTH version files:

// For package.json
{
"version": "4.1.4"
}

// For src/constant/env.ts
export const APP_VERSION = '4.1.4'

Note: APP_VERSION uses plain version format without 'v' prefix (e.g., '4.1.4' not 'v4.1.4')

4. Commit Version Change

git add package.json src/constant/env.ts
git commit -m "build: X.Y.Z"

5. Finish Release

git flow release finish X.Y.Z

# Example: git flow release finish 4.1.4

What happens during git flow release finish:

1. Merge message editor opens → Fill with changelog format (see step 6)
2. Tag message editor opens → **REQUIRED**: Enter date in parentheses format `(Month DD, YYYY)`
3. Merges to both main and develop branches
4. Deletes the release branch

**Troubleshooting: If `git flow release finish` fails during tagging:**

If you see `fatal: no tag message?` error, the merge was successful but tagging failed. Complete the release manually:

```bash
# Create the tag manually (message only needs date in parentheses)
git tag -a X.Y.Z -m "(Month DD, YYYY)"

# Example:
# git tag -a 2.0.1 -m "(February 18, 2026)"

# Switch to dev branch and merge the release
git checkout dev
git merge release/X.Y.Z --no-edit

# Delete the release branch
git branch -D release/X.Y.Z

# Continue with step 7 (Push to Remote)
```

### 6. Changelog Format (Merge Message)

In the merge message editor, use this format:

Month DD, YYYY

### Added

-   Feature A description
-   Feature B description

### Fixed

-   Bug A fix
-   Bug B fix

### Changed

-   Change A description

### Removed

-   Removed feature A

Save and close the editor.

### 7. Push to Remote

# Pull latest changes first

git pull origin main
git pull origin develop

# Push branches

git push origin main
git push origin develop

# Push tag

git push origin X.Y.Z

# Example: git push origin 4.1.4

### Notes

-   Always start release from dev branch (NOT develop - the branch name is `dev`)
-   Use semantic versioning (major.minor.patch)
-   Tag format: plain version number without 'v' prefix (e.g., 4.1.4)
-   Changelog format: Month DD, YYYY (e.g., January 17, 2026)
-   If conflicts occur during merge, resolve them and continue with git flow release finish --continue
-   If tagging fails during `git flow release finish`, follow the troubleshooting steps above

### Useful Commands

# List release branches

git branch | grep release

# Abort a release

git flow release abort

# Show release status

git flow release status
