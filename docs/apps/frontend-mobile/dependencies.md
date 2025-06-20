# Frontend Mobile Dependencies

This document outlines packages for the mobile-optimized Next.js application wrapped with Capacitor.

## Core Framework

### Next.js 15.3.4

- **Purpose**: React framework with SSR, routing, and optimization
- **Usage**: App router with `app/` directory structure
- **Build**: Static export for Capacitor
- **Commands**: `bun run dev`, `bun run build`, `bun run export`

### React 19

- **Purpose**: UI library with concurrent features
- **Usage**: Functional components with hooks
- **Key Features**: Improved suspense, concurrent rendering

### Capacitor

- **Purpose**: Native mobile app wrapper
- **Usage**: Wraps Next.js build for iOS/Android
- **Commands**: `bunx cap build`, `bunx cap run ios`, `bunx cap run android`

## Styling

### Tailwind CSS 4

- **Purpose**: Utility-first CSS framework
- **Usage**: Mobile-first utility classes
- **Config**: Optimized for mobile viewports
- **Best Practice**: Focus on touch-friendly sizing

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

### UI Components (Shared)

- [ ] `shadcn/ui` - Copy-paste component library (built on Radix UI)
- [ ] `@radix-ui/react-*` - Accessible primitives (auto-installed with shadcn)
- [ ] `lucide-react` - Icon library (recommended by shadcn)
- [ ] `class-variance-authority` - Component variants (used by shadcn)
- [ ] `tailwind-merge` - Tailwind class merging utility
- [ ] `tailwindcss-animate` - Animation utilities

### Forms & Validation (Shared)

- [ ] `react-hook-form` - Form management
- [ ] `zod` - Schema validation
- [ ] `@hookform/resolvers` - Form validation integration

### Capacitor Core

- [ ] `@capacitor/core` - Core Capacitor functionality
- [ ] `@capacitor/cli` - Capacitor CLI tools
- [ ] `@ionic/capacitor-config` - Configuration utilities

### Native APIs (Mobile-Specific)

- [ ] `@capacitor/camera` - Native camera and gallery access
- [ ] `@capacitor/filesystem` - File system operations
- [ ] `@capacitor/haptics` - Haptic feedback (vibration)
- [ ] `@capacitor/status-bar` - Status bar styling
- [ ] `@capacitor/splash-screen` - App loading screen
- [ ] `@capacitor/keyboard` - Keyboard behavior control
- [ ] `@capacitor/preferences` - Local storage (replaces localStorage)
- [ ] `@capacitor/share` - Native sharing functionality
- [ ] `@capacitor/network` - Network status for reliable uploads
- [ ] `@capacitor/device` - Device info for photo orientation handling

### Image Processing (Shared)

- [ ] `react-image-crop` - Crop photos to passport dimensions
- [ ] `browser-image-compression` - Client-side image compression
- [ ] `heic2any` - Convert iPhone HEIC photos to JPEG

### Data Fetching (Shared)

- [ ] `@tanstack/react-query` - Server state management
- [ ] `axios` - HTTP client

### Utilities (Shared)

- [ ] `clsx` - Conditional className utility
- [ ] `date-fns` - Date manipulation
- [ ] `sonner` - Toast notifications (mobile-optimized)

### Mobile Platform Specific

- [ ] `@capacitor/ios` - iOS platform support
- [ ] `@capacitor/android` - Android platform support

## Installation Guide

### Regular Packages

```bash
# Navigate to mobile frontend directory
cd apps/frontend-mobile

# Install package
bun add <package-name>

# Install dev dependency
bun add -d <package-name>
```

### Capacitor Setup

```bash
# Initialize Capacitor (one-time setup)
bunx cap init

# Add platforms
bunx cap add ios
bunx cap add android

# Sync after changes
bunx cap sync

# Build and run
bun run build && bunx cap sync
bunx cap run ios
bunx cap run android
```

### shadcn/ui Setup

```bash
# Initialize shadcn/ui (one-time setup)
bunx shadcn@latest init

# Add mobile-optimized components
bunx shadcn@latest add button input form card progress dialog sheet
```

## Usage Patterns

### Native Camera Integration

```tsx
// components/mobile-camera.tsx
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface MobileCameraProps {
  onPhotoCapture: (photoUrl: string) => void;
}

export function MobileCamera({ onPhotoCapture }: MobileCameraProps) {
  const [photo, setPhoto] = useState<string | null>(null);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath) {
        setPhoto(image.webPath);
        onPhotoCapture(image.webPath);
        toast.success("Photo captured successfully!");
      }
    } catch (error) {
      toast.error("Failed to capture photo");
    }
  };

  const selectFromGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      if (image.webPath) {
        setPhoto(image.webPath);
        onPhotoCapture(image.webPath);
        toast.success("Photo selected successfully!");
      }
    } catch (error) {
      toast.error("Failed to select photo");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Passport Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {photo && (
          <div className="w-full">
            <img
              src={photo}
              alt="Selected passport photo"
              className="w-full max-w-xs mx-auto rounded-lg shadow-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={takePhoto}
            className="w-full h-12 text-base"
            size="lg"
          >
            📷 Take Photo
          </Button>

          <Button
            onClick={selectFromGallery}
            variant="outline"
            className="w-full h-12 text-base"
            size="lg"
          >
            🖼️ Choose from Gallery
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Haptic Feedback Integration

```tsx
// utils/haptics.ts
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export const hapticFeedback = {
  light: () => Haptics.impact({ style: ImpactStyle.Light }),
  medium: () => Haptics.impact({ style: ImpactStyle.Medium }),
  heavy: () => Haptics.impact({ style: ImpactStyle.Heavy }),
  success: () => Haptics.notification({ type: "SUCCESS" }),
  error: () => Haptics.notification({ type: "ERROR" }),
  warning: () => Haptics.notification({ type: "WARNING" }),
};

// Usage in components
import { hapticFeedback } from "@/utils/haptics";

const handleButtonPress = () => {
  hapticFeedback.light();
  // Handle button action
};
```

### Local Storage with Preferences

```tsx
// utils/storage.ts
import { Preferences } from "@capacitor/preferences";

export const storage = {
  async set(key: string, value: any) {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  },

  async get(key: string) {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  },

  async remove(key: string) {
    await Preferences.remove({ key });
  },

  async clear() {
    await Preferences.clear();
  },
};
```

## Configuration Files

### Capacitor Config

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yourcompany.passportmaker",
  appName: "Passport Maker",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false,
    },
    StatusBar: {
      style: "light",
    },
    Camera: {
      permissions: ["camera", "photos"],
    },
  },
};

export default config;
```

### Next.js Config (Mobile)

```typescript
// next.config.ts
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
};

export default nextConfig;
```

## Build Process

### Development

```bash
# Start Next.js dev server
bun run dev

# Run on device (after build)
bun run build && bunx cap sync && bunx cap run ios
```

### Production

```bash
# Build Next.js app
bun run build

# Sync with Capacitor
bunx cap sync

# Build native apps
bunx cap build ios
bunx cap build android
```

## Notes

- Always use `bun` commands instead of `npm`/`yarn`
- Mobile app optimized for touch interactions
- Smaller file size limits for better mobile performance
- Native APIs preferred over web alternatives
- Focus on single-handed usage patterns
- Haptic feedback for better UX
- Handle mobile-specific considerations (safe areas, keyboard, etc.)
