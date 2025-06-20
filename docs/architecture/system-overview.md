# System Overview

## Vision

The passport-maker application enables users to capture, edit, and process passport photos that meet official requirements. The system is designed for **maximum performance and code quality** with a web-first approach and a high-performance backend.

## System Architecture

### High-Level Components

```
┌─────────────────┐
│   Web Frontend  │
│   (Next.js)     │
│                 │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   Backend API   │
│   (Fastify)     │
└─────────────────┘
```

**Current Focus**: High-performance web application  
**Future Ready**: Architecture supports mobile expansion when needed

### Core Workflow

1. **Photo Capture**

   - Web: File upload (drag & drop) or webcam
   - Mobile: Native camera or gallery selection

2. **Image Processing**

   - HEIC to JPEG conversion (iPhone compatibility)
   - Photo cropping to passport dimensions
   - Image compression for optimal upload size

3. **Backend Processing**

   - Photo validation and enhancement
   - Passport compliance checking
   - Final image generation

4. **Delivery**
   - Processed passport photo download
   - Print-ready format generation

## Monorepo Structure

```
passport-maker/
├── apps/
│   ├── frontend/           # High-performance Next.js web app
│   └── server/             # High-performance Fastify backend API
├── packages/               # Shared code (future optimization)
│   ├── ui/                # Reusable UI components
│   ├── utils/             # Performance utilities
│   ├── types/             # Shared TypeScript types
│   └── api/               # Optimized API client
└── docs/                  # Documentation
```

**Note**: Mobile-ready architecture exists in docs for future expansion, but current implementation focuses on **maximum web performance**.

## Key Architectural Decisions

### 1. Performance-First Web Strategy

- **Rationale**: Maximum performance and code quality for web users
- **Benefits**: Single codebase, faster development, optimal performance
- **Future**: Architecture ready for mobile expansion without compromising performance

### 2. Next.js for Maximum Performance

- **Rationale**: Best-in-class performance, developer experience, SSR capabilities
- **Implementation**: Full Next.js features optimized for web (SSR, API routes, image optimization)
- **Performance**: Turbopack, React 19 concurrent features, optimized builds

### 3. Fastify Backend

- **Rationale**: Performance, TypeScript support, plugin ecosystem
- **Benefits**: Fast startup, low overhead, excellent for APIs

### 4. Bun Runtime

- **Rationale**: Faster package management, built-in TypeScript, better DX
- **Benefits**: Unified tooling, faster builds, native TS support

## Data Architecture

### Image Processing Pipeline

```
Raw Photo → HEIC Conversion → Cropping → Compression → Validation → Processing → Output
```

### Storage Strategy

- **Client-side**: Temporary processing in browser/app memory
- **Backend**: Temporary storage during processing
- **Output**: Direct download (no permanent storage initially)

## Security Considerations

### Client-Side

- File type validation
- Size limitations
- Client-side image processing (privacy)

### Backend

- Input sanitization
- Rate limiting
- Secure file handling
- No permanent storage of user photos

## Performance Characteristics

### Web Frontend

- **Target**: Desktop and tablet users
- **Bundle Size**: ~2-3MB (acceptable for web)
- **Features**: Rich drag & drop, webcam access, PWA

### Mobile Frontend

- **Target**: iOS and Android users
- **Bundle Size**: ~1.5-2MB (mobile optimized)
- **Features**: Native camera, haptic feedback, offline capability

### Backend

- **Target**: Fast image processing
- **Scalability**: Stateless, horizontally scalable
- **Performance**: <2s processing time per image

## Integration Points

### Frontend ↔ Backend

- **Protocol**: HTTP/HTTPS
- **Format**: JSON API with multipart file uploads
- **Authentication**: Simple API key (initially)

### Mobile ↔ Native

- **Camera**: Capacitor Camera API
- **Storage**: Capacitor Preferences
- **Network**: Capacitor Network status

## Scalability Considerations

### Current Scale (MVP)

- Single backend instance
- Client-side image processing
- Direct file uploads

### Future Scale

- CDN for static assets
- Dedicated image processing workers
- Background job queues
- Database for user preferences

## Development Workflow

### Local Development

```bash
# Start all services
bun run dev          # Root command starts all apps
bun run dev:web      # Web frontend only
bun run dev:mobile   # Mobile frontend only
bun run dev:server   # Backend only
```

### Build Process

```bash
# Web deployment
cd apps/frontend-web && bun run build

# Mobile app builds
cd apps/frontend-mobile && bun run build && bunx cap sync

# Backend deployment
cd apps/server && bun run build
```

## Technology Rationale Summary

| Component      | Technology     | Rationale                              |
| -------------- | -------------- | -------------------------------------- |
| Frontend       | Next.js 15     | SSR, performance, developer experience |
| Mobile Wrapper | Capacitor      | Native access, web tech reuse          |
| Backend        | Fastify        | Performance, TypeScript, simple APIs   |
| Runtime        | Bun            | Speed, unified tooling, TypeScript     |
| Styling        | Tailwind CSS 4 | Utility-first, consistent design       |
| UI Components  | shadcn/ui      | Copy-paste, customizable, accessible   |
| Validation     | Zod            | Type-safe schemas, shared validation   |

## Next Steps

1. **MVP Implementation**: Basic photo upload and processing
2. **Enhanced Processing**: Advanced passport compliance checking
3. **User Features**: Photo history, preferences
4. **Scale Optimization**: CDN, caching, performance monitoring

This architecture provides a solid foundation for the passport-maker application while maintaining flexibility for future enhancements.
