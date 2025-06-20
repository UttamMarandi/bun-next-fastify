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

- [ ] `React Context` - Lightweight state management

### Data Fetching

- [ ] `@tanstack/react-query` - Server state management
- [ ] `axios` - HTTP client

### File Upload

- [ ] `react-dropzone` - File upload with drag & drop functionality
- [ ] `@types/react-dropzone` - TypeScript definitions (dev dependency)

### Utilities

- [ ] `clsx` - Conditional className utility
- [ ] `date-fns` - Date manipulation

## Installation Guide

### Regular Packages

```bash
# Navigate to frontend directory
cd apps/frontend

# Install package
bun add <package-name>

# Install dev dependency
bun add -d <package-name>
```

### shadcn/ui Setup

```bash
# Initialize shadcn/ui (one-time setup)
bunx shadcn@latest init

# Add individual components
bunx shadcn@latest add button
bunx shadcn@latest add input
bunx shadcn@latest add form

# Or add multiple components
bunx shadcn@latest add button input form card
```

## Usage Patterns

### shadcn/ui Components

```tsx
// Using shadcn/ui components (after bunx shadcn@latest add button)
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <div className="space-y-4">
      <Button variant="default">Default Button</Button>
      <Button variant="destructive">Destructive Button</Button>
      <Button variant="outline" size="sm">
        Small Outline
      </Button>
    </div>
  );
}
```

### Custom Component Structure

```tsx
// components/passport-form.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PassportForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Passport Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="image/*" />
        <Button type="submit">Process Photo</Button>
      </CardContent>
    </Card>
  );
}
```

### Photo Upload Example

```tsx
// components/photo-upload.tsx
import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void
}

export function PhotoUpload({ onPhotoSelect }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setPreview(URL.createObjectURL(file))
        onPhotoSelect(file)
      }
    }
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="space-y-4">
              <img 
                src={preview} 
                alt="Passport photo preview" 
                className="max-w-xs mx-auto rounded-lg shadow-sm"
              />
              <p className="text-sm text-gray-600">
                Click or drag to replace photo
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop passport photo here' : 'Upload passport photo'}
              </p>
              <p className="text-sm text-gray-500">
                JPG or PNG, max 5MB
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

### Form Example

```tsx
// When using react-hook-form + zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return <form onSubmit={handleSubmit(onSubmit)}>{/* form fields */}</form>;
}
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

## Notes

- Always use `bun` commands instead of `npm`/`yarn`
- Prefer TypeScript-first packages
- shadcn/ui components are copied to your codebase (not installed as dependencies)
- Check bundle size impact before adding heavy libraries
- Follow existing patterns in the codebase
