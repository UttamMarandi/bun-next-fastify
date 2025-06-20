# Frontend Dependencies

This document outlines the packages and libraries used in the Next.js frontend application.

## Core Framework

### Next.js 15.3.4
- **Purpose**: React framework with SSR, routing, and optimization
- **Usage**: App router with `app/` directory structure
- **Commands**: `bun run dev`, `bun run build`, `bun run start`

### React 19
- **Purpose**: UI library with concurrent features
- **Usage**: Functional components with hooks
- **Key Features**: Improved suspense, concurrent rendering

## Styling

### Tailwind CSS 4
- **Purpose**: Utility-first CSS framework
- **Usage**: Utility classes for styling
- **Config**: `postcss.config.mjs`, `tailwindcss` package
- **Best Practice**: Prefer utilities over custom CSS

## Development Tools

### TypeScript 5
- **Purpose**: Type safety and better tooling
- **Usage**: Strict mode enabled
- **Files**: All `.ts`/`.tsx` files

### ESLint
- **Purpose**: Code linting and style enforcement
- **Config**: `eslint-config-next`
- **Command**: `bun run lint`

## Package Management

### Bun
- **Purpose**: Fast package manager and runtime
- **Usage**: `bun install`, `bun run <script>`
- **Benefits**: Faster than npm/yarn, built-in TypeScript support

## Recommended Packages (To Add)

### UI Components
- [ ] `@radix-ui/react-*` - Accessible UI primitives
- [ ] `lucide-react` - Icon library
- [ ] `class-variance-authority` - Component variants

### Forms & Validation
- [ ] `react-hook-form` - Form management
- [ ] `zod` - Schema validation
- [ ] `@hookform/resolvers` - Form validation integration

### State Management
- [ ] `zustand` - Lightweight state management (if Context API isn't enough)

### Data Fetching
- [ ] `@tanstack/react-query` - Server state management
- [ ] `axios` or `ky` - HTTP client

### Utilities
- [ ] `clsx` - Conditional className utility
- [ ] `date-fns` - Date manipulation
- [ ] `lodash-es` - Utility functions (tree-shakeable)

## Installation Guide

When adding new packages:

```bash
# Navigate to frontend directory
cd apps/frontend

# Install package
bun add <package-name>

# Install dev dependency
bun add -d <package-name>
```

## Usage Patterns

### Component Structure
```tsx
// components/ui/button.tsx
import { clsx } from 'clsx'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800'
      )}
    >
      {children}
    </button>
  )
}
```

### Form Example
```tsx
// When using react-hook-form + zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
})

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  )
}
```

## Notes

- Always use `bun` commands instead of `npm`/`yarn`
- Prefer TypeScript-first packages
- Check bundle size impact before adding heavy libraries
- Follow existing patterns in the codebase