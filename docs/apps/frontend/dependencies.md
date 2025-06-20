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
- [ ] `heic2any` - Convert iPhone HEIC photos to JPEG

### Image Validation (Critical for Passport Compliance)

- [ ] `face-api.js` - Client-side face detection and analysis
- [ ] `@mediapipe/face_detection` - Alternative face detection (Google)
- [ ] `opencv.js` - Computer vision for background analysis
- [ ] `jimp` - Lightweight image analysis (alternative to OpenCV)
- [ ] `exif-js` - EXIF data reading for photo metadata

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

### Image Processing & Validation (Shared)

```tsx
// utils/image-processing.ts
import imageCompression from 'browser-image-compression';
import * as faceapi from 'face-api.js';

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

// Image validation utilities
export interface ValidationResult {
  valid: boolean;
  score: number; // 0-100
  issues: string[];
  suggestions: string[];
}

export async function validatePassportPhoto(file: File): Promise<ValidationResult> {
  const results = await Promise.all([
    validateFaceCount(file),
    validateFaceQuality(file),
    validateBackground(file),
    validateTechnical(file)
  ]);
  
  const valid = results.every(r => r.valid);
  const score = Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length);
  const issues = results.flatMap(r => r.issues);
  const suggestions = results.flatMap(r => r.suggestions);
  
  return { valid, score, issues, suggestions };
}

export async function validateFaceCount(file: File): Promise<ValidationResult> {
  // Load face-api.js models if not already loaded
  await loadFaceAPIModels();
  
  const img = await loadImageFromFile(file);
  const detections = await faceapi.detectAllFaces(img);
  
  const faceCount = detections.length;
  const valid = faceCount === 1;
  const score = valid ? 100 : 0;
  
  return {
    valid,
    score,
    issues: valid ? [] : [
      faceCount === 0 ? 'No face detected' : `${faceCount} faces detected`
    ],
    suggestions: valid ? [] : [
      faceCount === 0 ? 'Make sure your face is visible and well-lit' :
      'Only one person should be in the photo'
    ]
  };
}

export async function loadFaceAPIModels(): Promise<void> {
  const MODEL_URL = '/models';
  
  if (!faceapi.nets.ssdMobilenetv1.isLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  }
  if (!faceapi.nets.faceLandmark68Net.isLoaded) {
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  }
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
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

## Performance Impact & Load Times

### Image Validation Package Sizes
```
face-api.js models: ~6.2MB (loaded lazily)
├── ssd_mobilenetv1: ~2.3MB
├── face_landmark_68: ~1.4MB  
└── face_recognition: ~2.5MB

opencv.js: ~8.7MB (WASM binary)
jimp: ~400KB (pure JS alternative)
@mediapipe/face_detection: ~1.2MB
```

### Estimated Load Time Impact
```
Initial bundle increase: +50-100KB (validation logic)
Lazy-loaded models: 6-15MB (downloaded on first use)

Load times (3G connection):
├── Initial app load: +0.2-0.5s
├── First validation: +2-4s (model download)
└── Subsequent validations: <100ms

Recommended strategy:
├── Preload models on app start (background)
├── Show loading state during first validation  
└── Cache models in browser storage
```

### Memory Usage
```
face-api.js: 30-50MB RAM (models loaded)
opencv.js: 20-40MB RAM (WASM runtime)
Image processing: 10-20MB per photo

Recommended limits:
├── Max concurrent validations: 2-3
├── Model cleanup after 5min idle
└── Image cleanup after processing
```

### Capacitor Compatibility

#### ✅ Fully Compatible
- `face-api.js` - Works in WebView (tested iOS/Android)
- `jimp` - Pure JavaScript, full compatibility
- `browser-image-compression` - WebView compatible
- `exif-js` - Works in mobile WebView

#### ⚠️ Limited Support
- `opencv.js` - WASM support varies by WebView version
  - iOS: Works on iOS 14.5+
  - Android: Works on Android 7+ (WebView 67+)
  - Alternative: Use `jimp` for basic operations

#### ❌ Web-Only
- `@mediapipe/face_detection` - Requires specific browser APIs
  - Use `face-api.js` as primary for mobile compatibility

### Mobile-Specific Considerations
```typescript
// Platform detection for optimal library selection
const isCapacitor = () => !!window.Capacitor;
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const getOptimalValidationConfig = () => {
  if (isCapacitor() || isMobile()) {
    return {
      faceDetection: 'face-api.js',     // Reliable on mobile
      imageAnalysis: 'jimp',            // Lightweight alternative
      backgroundAnalysis: 'canvas-api', // Native browser support
      modelSize: 'small'                // Faster loading
    };
  }
  
  return {
    faceDetection: 'face-api.js',
    imageAnalysis: 'opencv.js',        // Full feature set
    backgroundAnalysis: 'opencv.js',
    modelSize: 'full'                  // Best accuracy
  };
};
```

## Notes

- Always use `bun` commands instead of `npm`/`yarn`
- Prefer TypeScript-first packages for better shared code experience
- shadcn/ui components are copied to each app (not installed as dependencies)
- Extract reusable components to workspace packages after validation
- Check bundle size impact before adding heavy libraries to shared packages
- Platform-specific implementations should be in respective app directories
- **Image validation adds 50-100KB to bundle + 6-15MB lazy-loaded models**
- **Preload validation models in background for better UX**
- **Use progressive validation (fail fast) to minimize resource usage**
