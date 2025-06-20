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

### Image Validation (Web-Optimized)

- [ ] `face-api.js` - Client-side face detection and analysis
- [ ] `@mediapipe/face_detection` - Google's face detection (web-optimized)
- [ ] `opencv.js` - Full computer vision capabilities
- [ ] `jimp` - Lightweight image analysis (fallback)
- [ ] `exif-js` - EXIF data reading and analysis
- [ ] `@tensorflow/tfjs` - Optional: Custom model loading

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

### Web Camera Capture with Validation

```tsx
// components/web-camera-validation.tsx
import Webcam from "react-webcam";
import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { validatePassportPhoto, ValidationResult } from "@/utils/image-validation";
import { toast } from "sonner";

interface WebCameraValidationProps {
  onValidCapture: (file: File, validation: ValidationResult) => void;
}

export function WebCameraValidation({ onValidCapture }: WebCameraValidationProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setCapturedImage(imageSrc);
    setIsValidating(true);
    
    try {
      // Convert data URL to File
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
      
      // Validate the captured photo
      const result = await validatePassportPhoto(file);
      setValidation(result);
      
      if (result.valid) {
        toast.success(`Excellent photo! Score: ${result.score}/100`);
        onValidCapture(file, result);
      } else {
        toast.error(`Photo needs improvement (Score: ${result.score}/100)`);
      }
    } catch (error) {
      toast.error('Failed to validate photo');
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, [onValidCapture]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setValidation(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Take Passport Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!capturedImage ? (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
              videoConstraints={{
                facingMode: "user",
                width: 1280,
                height: 720,
              }}
            />
            <Button onClick={capture} className="w-full" size="lg">
              📷 Capture Photo
            </Button>
          </>
        ) : (
          <>
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured photo"
                className="w-full rounded-lg"
              />
              
              {/* Validation Overlay */}
              {validation && (
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
                  validation.valid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {validation.valid ? '✅ Valid' : '❌ Issues Found'}
                </div>
              )}
            </div>
            
            {/* Validation Progress */}
            {isValidating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Analyzing photo quality...</span>
                  <span>Processing</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>
            )}
            
            {/* Validation Results */}
            {validation && !isValidating && (
              <div className={`p-4 rounded-lg border ${
                validation.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-medium ${
                    validation.valid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {validation.valid ? 'Photo Ready!' : 'Needs Improvement'}
                  </h4>
                  <span className={`px-2 py-1 rounded text-sm ${
                    validation.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {validation.score}/100
                  </span>
                </div>
                
                {validation.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Suggestions:</p>
                    <ul className="space-y-1">
                      {validation.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={retakePhoto} 
                variant="outline" 
                className="w-full"
                disabled={isValidating}
              >
                🔄 Retake
              </Button>
              
              {validation?.valid && (
                <Button 
                  onClick={() => onValidCapture(/* file */, validation)}
                  className="w-full"
                >
                  ✅ Use Photo
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

### Enhanced Web Photo Upload with Real-time Validation

```tsx
// components/web-photo-upload-validation.tsx
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { validatePassportPhoto, ValidationResult } from "@/utils/image-validation";
import { toast } from "sonner";

interface WebPhotoUploadValidationProps {
  onValidPhoto: (file: File, validation: ValidationResult) => void;
}

export function WebPhotoUploadValidation({ onValidPhoto }: WebPhotoUploadValidationProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const validateFile = useCallback(async (file: File) => {
    setIsValidating(true);
    
    try {
      const result = await validatePassportPhoto(file);
      setValidation(result);
      
      if (result.valid) {
        toast.success(`Great photo! Score: ${result.score}/100`);
        onValidPhoto(file, result);
      } else {
        toast.warning(`Photo score: ${result.score}/100. Check suggestions below.`);
      }
    } catch (error) {
      toast.error('Failed to validate photo');
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, [onValidPhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
    },
    maxSize: 15 * 1024 * 1024, // 15MB limit for web
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setCurrentFile(file);
        setPreview(URL.createObjectURL(file));
        setValidation(null);
        
        // Auto-validate after upload
        await validateFile(file);
      }
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          
          {preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Passport photo preview"
                  className="max-w-xs mx-auto rounded-lg shadow-sm"
                />
                
                {/* Validation Badge */}
                {validation && (
                  <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${
                    validation.valid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {validation.score}
                  </div>
                )}
              </div>
              
              {/* Validation Progress */}
              {isValidating && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Analyzing photo quality...</p>
                  <Progress value={75} className="h-2" />
                </div>
              )}
              
              {/* Validation Results */}
              {validation && !isValidating && (
                <div className={`text-left p-4 rounded-lg border max-w-md mx-auto ${
                  validation.valid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${
                      validation.valid ? 'text-green-800' : 'text-orange-800'
                    }`}>
                      {validation.valid ? '✅ Passport Ready' : '⚠️ Suggestions Available'}
                    </span>
                    <span className="text-sm text-gray-600">Score: {validation.score}/100</span>
                  </div>
                  
                  {validation.suggestions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {validation.suggestions.slice(0, 3).map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-orange-500">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-600">
                {isDragActive ? "Drop new photo here" : "Click or drag to replace photo"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-xl font-medium">
                {isDragActive
                  ? "Drop passport photo here"
                  : "Upload passport photo"}
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, HEIC • Max 15MB • Instant validation
              </p>
            </div>
          )}
        </div>
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

## Web Performance Impact & Optimization

### Image Validation Package Sizes (Web-Optimized)
```
face-api.js (full models): ~6.2MB
├── ssd_mobilenetv1: ~2.3MB
├── face_landmark_68: ~1.4MB  
└── face_recognition: ~2.5MB

@mediapipe/face_detection: ~1.2MB (web-optimized)
opencv.js: ~8.7MB (full computer vision)
jimp: ~400KB (lightweight fallback)
exif-js: ~45KB
@tensorflow/tfjs: ~800KB (if using custom models)
```

### Web Load Time Impact
```
Initial bundle increase: +80-120KB (validation logic)
Lazy-loaded models: 6-15MB (high-quality models)

Load times (broadband):
├── Initial app load: +0.3-0.7s
├── First validation: +1-3s (model download)
└── Subsequent validations: <50ms

Web optimization strategies:
├── Preload models on app start
├── Use Web Workers for processing
├── Implement model caching (IndexedDB)
└── Progressive enhancement (basic → advanced)
```

### Memory Usage (Web)
```
face-api.js: 40-60MB RAM (full models)
opencv.js: 30-50MB RAM (WASM runtime)
Image processing: 15-30MB per photo
Web Workers: +10-20MB isolation

Web memory management:
├── Use Web Workers to prevent UI blocking
├── Implement model cleanup after 10min idle
├── Process images in chunks for large files
└── Monitor memory usage via Performance API
```

### Advanced Web Features

#### Web Workers Implementation
```typescript
// workers/validation-worker.ts
import * as faceapi from 'face-api.js';

self.addEventListener('message', async (event) => {
  const { imageData, config } = event.data;
  
  try {
    // Initialize models in worker
    await loadModelsInWorker();
    
    // Run validation without blocking main thread
    const result = await validateImageInWorker(imageData, config);
    
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
});

async function loadModelsInWorker() {
  // Load models in Web Worker context
  await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  // ... other models
}
```

#### IndexedDB Model Caching
```typescript
// utils/model-cache.ts
interface CachedModel {
  name: string;
  data: ArrayBuffer;
  version: string;
  timestamp: number;
}

export class ModelCache {
  private dbName = 'passport-validation-models';
  private version = 1;
  
  async cacheModel(name: string, data: ArrayBuffer): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(['models'], 'readwrite');
    const store = transaction.objectStore('models');
    
    await store.put({
      name,
      data,
      version: '1.0.0',
      timestamp: Date.now()
    });
  }
  
  async getCachedModel(name: string): Promise<ArrayBuffer | null> {
    const db = await this.openDB();
    const transaction = db.transaction(['models'], 'readonly');
    const store = transaction.objectStore('models');
    
    const cached = await store.get(name);
    
    // Check if cache is still valid (7 days)
    if (cached && Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return cached.data;
    }
    
    return null;
  }
  
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('models')) {
          db.createObjectStore('models', { keyPath: 'name' });
        }
      };
    });
  }
}
```

#### Performance Monitoring
```typescript
// utils/performance-monitor.ts
export class ValidationPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  startTiming(operation: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, []);
      }
      
      this.metrics.get(operation)!.push(duration);
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`Slow validation operation: ${operation} took ${duration.toFixed(2)}ms`);
      }
    };
  }
  
  getAverageTime(operation: string): number {
    const times = this.metrics.get(operation) || [];
    return times.reduce((a, b) => a + b, 0) / times.length;
  }
  
  getMemoryUsage(): MemoryInfo | undefined {
    return (performance as any).memory;
  }
}

// Usage
const monitor = new ValidationPerformanceMonitor();

export async function validateWithMonitoring(file: File): Promise<ValidationResult> {
  const endTiming = monitor.startTiming('full-validation');
  
  try {
    const result = await validatePassportPhoto(file);
    return result;
  } finally {
    endTiming();
    
    // Log memory usage
    const memory = monitor.getMemoryUsage();
    if (memory && memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
      console.warn('High memory usage detected:', memory);
    }
  }
}
```

### Browser Compatibility

#### ✅ Fully Supported (Modern Browsers)
```
face-api.js: Chrome 70+ | Firefox 65+ | Safari 12+ | Edge 79+
├── WebGL support required
├── Canvas API for image processing
└── Fetch API for model loading

opencv.js: Chrome 57+ | Firefox 52+ | Safari 11+ | Edge 16+
├── WebAssembly support required
├── SharedArrayBuffer for performance
└── Web Workers for non-blocking processing

@mediapipe/face_detection: Chrome 80+ | Firefox 72+ | Safari 13+
├── Modern browser APIs required
└── Best performance on Chrome
```

#### ⚠️ Graceful Degradation
```
Older browsers (IE11, Chrome <70):
├── Fallback to jimp for basic validation
├── Server-side validation as backup
└── Progressive enhancement approach
```

#### Feature Detection
```typescript
// utils/browser-support.ts
export const detectBrowserSupport = () => {
  const support = {
    webgl: !!window.WebGLRenderingContext,
    wasm: typeof WebAssembly === 'object',
    webWorkers: typeof Worker !== 'undefined',
    indexedDB: !!window.indexedDB,
    canvas: !!document.createElement('canvas').getContext,
  };
  
  const validationSupport = {
    faceapi: support.webgl && support.canvas,
    opencv: support.wasm && support.webWorkers,
    mediapipe: support.webgl && 'MediaStreamTrack' in window,
    basic: support.canvas, // jimp fallback
  };
  
  return { support, validationSupport };
};

export const getOptimalValidationStrategy = () => {
  const { validationSupport } = detectBrowserSupport();
  
  if (validationSupport.mediapipe) {
    return 'mediapipe'; // Best for modern Chrome
  } else if (validationSupport.faceapi) {
    return 'faceapi';   // Good cross-browser support
  } else if (validationSupport.basic) {
    return 'basic';     // Fallback to jimp
  } else {
    return 'server';    // Server-side validation only
  }
};
```

## Notes

- Always use `bun` commands instead of `npm`/`yarn`
- Web app optimized for desktop and tablet experiences
- **Image validation adds 80-120KB + 6-15MB models (web-optimized)**
- **Use Web Workers to prevent UI blocking during validation**
- **Implement model caching with IndexedDB for better performance**
- Larger file size limits compared to mobile version (15MB vs 10MB)
- PWA features for offline functionality
- Focus on drag-and-drop UX patterns
- Use web-native file handling APIs
- **Progressive enhancement: basic validation → advanced AI features**
- **Monitor memory usage and implement cleanup for long sessions**
- **face-api.js recommended for best cross-browser compatibility**
