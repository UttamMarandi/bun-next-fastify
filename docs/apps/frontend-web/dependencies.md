# Frontend Web Dependencies

This document outlines packages for the web-optimized Next.js application.

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

## Required Packages

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

### File Upload (Web-Specific)

- [ ] `react-dropzone` - File upload with drag & drop functionality
- [ ] `@types/react-dropzone` - TypeScript definitions (dev dependency)
- [ ] `react-webcam` - Web camera access for photo capture

### Image Processing

- [ ] `react-image-crop` - Crop photos to passport dimensions
- [ ] `browser-image-compression` - Client-side image compression
- [ ] `heic2any` - Convert iPhone HEIC photos to JPEG

### Data Fetching

- [ ] `@tanstack/react-query` - Server state management
- [ ] `axios` - HTTP client

### Utilities

- [ ] `clsx` - Conditional className utility
- [ ] `date-fns` - Date manipulation
- [ ] `sonner` - Toast notifications

### Web Performance & PWA

- [ ] `next-pwa` - Progressive Web App features
- [ ] `@vercel/analytics` - Analytics (if deploying to Vercel)
- [ ] `next-seo` - SEO optimization

## Installation Guide

### Regular Packages

```bash
# Navigate to web frontend directory
cd apps/frontend-web

# Install package
bun add <package-name>

# Install dev dependency
bun add -d <package-name>
```

### shadcn/ui Setup

```bash
# Initialize shadcn/ui (one-time setup)
bunx shadcn@latest init

# Add components for passport app
bunx shadcn@latest add button input form card progress dialog
```

## Usage Patterns

### Web Photo Upload with Dropzone

```tsx
// components/web-photo-upload.tsx
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WebPhotoUploadProps {
  onPhotoSelect: (file: File) => void;
}

export function WebPhotoUpload({ onPhotoSelect }: WebPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB limit for web
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        onPhotoSelect(file);
      }
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
            <div className="space-y-4">
              <p className="text-lg font-medium">
                {isDragActive
                  ? "Drop passport photo here"
                  : "Upload passport photo"}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400">JPG or PNG, max 10MB</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Web Camera Capture

```tsx
// components/web-camera.tsx
import Webcam from "react-webcam";
import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WebCameraProps {
  onCapture: (imageSrc: string) => void;
}

export function WebCamera({ onCapture }: WebCameraProps) {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Take Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full rounded-lg"
          videoConstraints={{
            facingMode: "user",
          }}
        />
        <Button onClick={capture} className="w-full">
          Capture Photo
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Path Aliases Setup

Ensure your `tsconfig.json` has:

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

## Build Optimization

### Next.js Config

```javascript
// next.config.ts
import withPWA from "next-pwa";

const nextConfig = {
  // Optimize for web deployment
  output: "standalone",
  images: {
    domains: ["your-api-domain.com"],
    formats: ["image/webp", "image/avif"],
  },
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);
```

## Notes

- Always use `bun` commands instead of `npm`/`yarn`
- Web app optimized for desktop and tablet experiences
- Larger file size limits compared to mobile version
- PWA features for offline functionality
- Focus on drag-and-drop UX patterns
- Use web-native file handling APIs
