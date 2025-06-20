# Shared Frontend Dependencies

This document outlines packages and libraries shared between both web and mobile frontend applications.

> **Note**: For platform-specific packages, see:
> - [Web-specific dependencies](../frontend-web/dependencies.md)
> - [Mobile-specific dependencies](../frontend-mobile/dependencies.md)

## Core Framework

### Next.js 15.3.4

- **Purpose**: React framework with SSR, routing, and optimization
- **Usage**: App router with `app/` directory structure
- **Commands**: `bun run dev`, `bun run build`
- **Note**: Build commands differ between web (`bun run start`) and mobile (`bun run export`)

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

## Shared Packages (Both Web & Mobile)

### UI Components

- [ ] `shadcn/ui` - Copy-paste component library (built on Radix UI)
- [ ] `@radix-ui/react-*` - Accessible primitives (auto-installed with shadcn)
- [ ] `lucide-react` - Icon library (recommended by shadcn)
- [ ] `class-variance-authority` - Component variants (used by shadcn)
- [ ] `tailwind-merge` - Tailwind class merging utility
- [ ] `tailwindcss-animate` - Animation utilities

### Forms & Validation

- [ ] `react-hook-form` - Form management
- [ ] `zod` - Schema validation
- [ ] `@hookform/resolvers` - Form validation integration

### State Management

- [ ] `React Context` - Lightweight state management for shared state

### Data Fetching

- [ ] `@tanstack/react-query` - Server state management
- [ ] `axios` - HTTP client

### Image Processing

- [ ] `react-image-crop` - Crop photos to passport dimensions
- [ ] `browser-image-compression` - Client-side image compression

### Utilities

- [ ] `clsx` - Conditional className utility
- [ ] `date-fns` - Date manipulation
- [ ] `sonner` - Toast notifications (works on both platforms)

## Platform-Specific Packages

### File Upload & Camera
- **Web**: Uses `react-dropzone` + `react-webcam` → See [web dependencies](../frontend-web/dependencies.md)
- **Mobile**: Uses `@capacitor/camera` → See [mobile dependencies](../frontend-mobile/dependencies.md)

### Performance & PWA
- **Web**: `next-pwa`, `@vercel/analytics` → See [web dependencies](../frontend-web/dependencies.md)
- **Mobile**: Capacitor plugins (`@capacitor/haptics`, etc.) → See [mobile dependencies](../frontend-mobile/dependencies.md)

## Installation Guide

### Shared Package Installation

```bash
# For web frontend
cd apps/frontend-web
bun add <shared-package-name>

# For mobile frontend  
cd apps/frontend-mobile
bun add <shared-package-name>
```

### shadcn/ui Setup (Both Apps)

```bash
# Initialize shadcn/ui in each app
cd apps/frontend-web && bunx shadcn@latest init
cd apps/frontend-mobile && bunx shadcn@latest init

# Add shared components to both apps
bunx shadcn@latest add button input form card progress
```

## Shared Usage Patterns

### shadcn/ui Components (Works on Both Platforms)

```tsx
// components/shared/ui-components.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SharedCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

export function SharedButton({ variant = "default", children, ...props }: any) {
  return (
    <Button variant={variant} {...props}>
      {children}
    </Button>
  );
}
```

### Form Validation (Shared)

```tsx
// utils/shared-schemas.ts
import { z } from "zod";

export const passportPhotoSchema = z.object({
  photo: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    "File size must be less than 10MB"
  ).refine(
    (file) => ["image/jpeg", "image/png"].includes(file.type),
    "Only JPEG and PNG files are allowed"
  ),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type PassportPhotoForm = z.infer<typeof passportPhotoSchema>;
```

### Image Processing (Shared)

```tsx
// utils/image-processing.ts
import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
}

export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}
```

### API Client (Shared)

```tsx
// lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
});

export async function uploadPassportPhoto(file: File) {
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await apiClient.post('/api/passport/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}

export { apiClient };
```

## Path Aliases Setup

For shadcn/ui to work properly, ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Architecture for Shared Code

### Workspace Structure
```
packages/
├── ui/                  # Shared shadcn components
├── utils/              # Shared utilities  
├── types/              # Shared TypeScript types
└── api/                # Shared API client

apps/
├── frontend-web/       # Web-specific implementation
├── frontend-mobile/    # Mobile-specific implementation  
└── server/            # Shared backend API
```

### Sharing Strategy
- **UI Components**: Copy shadcn components to both apps, extract custom shared ones to `packages/ui`
- **Business Logic**: Extract to `packages/utils` and import in both apps
- **API Layer**: Shared client in `packages/api` with platform-specific adapters
- **Types**: Shared TypeScript definitions in `packages/types`

## Notes

- Always use `bun` commands instead of `npm`/`yarn`
- Prefer TypeScript-first packages for better shared code experience
- shadcn/ui components are copied to each app (not installed as dependencies)
- Extract reusable components to workspace packages after validation
- Check bundle size impact before adding heavy libraries to shared packages
- Platform-specific implementations should be in respective app directories
