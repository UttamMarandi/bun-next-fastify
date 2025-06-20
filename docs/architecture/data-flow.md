# Data Flow

## Overview

This document describes how passport photos move through the passport-maker system, from initial user upload to final processed output. The data flow is designed for **maximum performance** and **user privacy**.

## High-Level Data Flow

```
User Input → Client Processing → Backend Processing → Passport Output
     ↓              ↓                    ↓                ↓
File/Camera → Basic Crop → Face Detection/AI Processing → Country-Compliant Photo
                              ↓
                    Background Removal + White BG
                              ↓
                    Country-Specific Sizing
```

## Detailed Flow Stages

### Stage 1: Photo Input
```
┌─────────────────┐
│ User Interface  │
│ - File Upload   │
│ - Webcam        │  
│ - Drag & Drop   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ File Validation │
│ - Type Check    │
│ - Size Check    │
│ - Format Check  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ HEIC Conversion │
│ (iPhone photos) │
└─────────┬───────┘
          │
          ▼
    Raw Image File
```

**Performance Notes:**
- **Client-side validation** prevents unnecessary uploads
- **HEIC conversion** happens immediately for iPhone compatibility
- **File size limits** protect against memory issues

### Stage 2: Client-Side Processing
```
Raw Image File
     │
     ▼
┌─────────────────┐
│ Image Cropping  │
│ - Passport size │
│ - User adjust   │
│ - Preview       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Image Compress  │
│ - Quality opt   │
│ - Size reduce   │
│ - Format conv   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Upload Ready    │
│ - Optimized     │
│ - Validated     │
│ - Processed     │
└─────────┬───────┘
          │
          ▼
  Processed Image
```

**Performance Benefits:**
- **Client-side processing** reduces server load
- **Real-time preview** improves user experience
- **Pre-compression** speeds up upload
- **Local processing** maintains privacy

### Stage 3: Backend AI Processing
```
Frontend                    Backend
    │                          │
    ▼                          │
┌─────────────────┐           │
│ Upload Request  │           │
│ - FormData      │           │
│ - Metadata      │           │
│ - Auth token    │           │
└─────────┬───────┘           │
          │                   │
          └──── HTTP POST ────▶│
                               │
                               ▼
                    ┌─────────────────┐
                    │ Request Handler │
                    │ - Validate      │
                    │ - Auth check    │
                    │ - Rate limit    │
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Face Detection  │
                    │ - face-api.js   │
                    │ - Auto crop     │
                    │ - Position check│
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Background Rem  │
                    │ - Traditional   │
                    │ - White BG      │
                    │ - Edge refine   │
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Sharp Process   │
                    │ - Country size  │
                    │ - Quality enh   │
                    │ - Compliance    │
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Response        │
                    │ - Processed img │
                    │ - Metadata      │
                    │ - Download URL  │
                    └─────────┬───────┘
                              │
          ┌─── HTTP Response ──┘
          │
          ▼
┌─────────────────┐
│ Download Ready  │
│ - Success UI    │
│ - Download link │
│ - Print options │
└─────────────────┘
```

## Data Structures

### Frontend Data Models

```typescript
// Input file from user
interface InputPhoto {
  file: File;
  preview: string;
  metadata: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
}

// After client processing
interface ProcessedPhoto {
  file: File;
  preview: string;
  cropData: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  compression: {
    quality: number;
    originalSize: number;
    compressedSize: number;
  };
}

// Upload payload
interface UploadPayload {
  photo: File;
  metadata: {
    originalName: string;
    cropData: CropData;
    compressionRatio: number;
  };
  preferences: {
    country: CountryCode; // Critical for passport requirements
    outputFormat: 'jpeg' | 'png';
    quality: 'standard' | 'high';
    printSize: PassportSize;
    backgroundRemoval: boolean;
    autoFaceCrop: boolean;
  };
}

// Country-specific passport requirements
interface CountryPassportSpec {
  code: CountryCode;
  name: string;
  requirements: {
    dimensions: {
      width: number;
      height: number;
      unit: 'mm' | 'inches';
      dpi: number;
    };
    faceRequirements: {
      heightPercent: number; // Face height as % of total
      positionFromTop: number; // Face center position
      eyeLevel: number; // Eye level position
      margins: {
        top: number;
        bottom: number;
        sides: number;
      };
    };
    background: {
      color: string; // Usually white
      uniformity: boolean;
      shadows: boolean;
    };
    quality: {
      minDPI: number;
      compression: 'none' | 'minimal' | 'standard';
      colorSpace: 'sRGB' | 'AdobeRGB';
    };
  };
}

type CountryCode = 'US' | 'UK' | 'IN' | 'CA' | 'AU' | 'EU' | 'JP' | 'CN';
type PassportSize = 'passport' | 'visa' | 'id';
```

### Backend Data Models

```typescript
// Incoming request
interface PhotoUploadRequest {
  file: Buffer;
  filename: string;
  mimetype: string;
  metadata: PhotoMetadata;
  preferences: UserPreferences;
  countrySpec: CountryPassportSpec;
}

// Face detection result
interface FaceDetectionResult {
  faces: Array<{
    box: { x: number; y: number; width: number; height: number };
    landmarks: {
      leftEye: Point;
      rightEye: Point;
      nose: Point;
      mouth: Point;
    };
    confidence: number;
  }>;
  primaryFace: number; // Index of main face
  compliance: {
    faceSize: boolean;
    facePosition: boolean;
    eyeLevel: boolean;
    frontFacing: boolean;
  };
}

// Background removal result
interface BackgroundRemovalResult {
  success: boolean;
  processedImage: Buffer;
  mask: Buffer; // Alpha mask for refinement
  confidence: number;
  edges: {
    smooth: boolean;
    artifacts: boolean;
  };
}

// Sharp processing result
interface SharpProcessingResult {
  success: boolean;
  processedImage: Buffer;
  metadata: {
    dimensions: { width: number; height: number };
    dpi: number;
    fileSize: number;
    format: string;
    quality: number;
    colorProfile: string;
  };
  compliance: PassportCompliance;
}

interface PassportCompliance {
  country: CountryCode;
  compliant: boolean;
  issues: Array<{
    type: 'face_size' | 'face_position' | 'background' | 'quality' | 'dimensions';
    severity: 'error' | 'warning';
    message: string;
    suggestion: string;
  }>;
  score: number; // 0-100 compliance score
}

// API response
interface UploadResponse {
  success: boolean;
  data?: {
    downloadUrl: string;
    previewUrl: string;
    metadata: SharpProcessingResult['metadata'];
    compliance: PassportCompliance;
    alternativeCountries?: CountryCode[]; // If current country fails
    expiresAt: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Performance Optimization Points

### 1. Client-Side Optimizations
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Web Workers     │  │ Canvas API      │  │ Stream Upload   │
│ - Heavy compute │  │ - Image manip   │  │ - Chunked       │
│ - Non-blocking  │  │ - Real-time     │  │ - Resumable     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Benefits:**
- **Web Workers**: Heavy processing doesn't block UI
- **Canvas API**: Fast image manipulation
- **Streaming**: Large files upload efficiently

### 2. Backend AI/Image Processing Optimizations
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Sharp (Native)  │  │ Face-API Cache  │  │ OpenCV.js       │
│ - C++ binding   │  │ - Model cache   │  │ - Traditional   │
│ - SIMD ops      │  │ - Fast detect   │  │ - Computer vis  │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Memory Streams  │  │ Parallel Proc   │  │ CDN Delivery    │
│ - No disk I/O   │  │ - Multi-core    │  │ - Fast download │
│ - Fast access   │  │ - Pipeline      │  │ - Global cache  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Benefits:**
- **Sharp**: Native C++ performance for image processing
- **Face-API Cache**: Pre-loaded models for instant detection
- **OpenCV.js**: Traditional computer vision algorithms
- **Pipeline Processing**: Parallel face detection + background removal

### 3. Network Optimizations
```
Upload: Client → Backend
┌─────────────────┐
│ Compression     │ 2MB → 500KB
│ Validation      │ Prevent bad uploads  
│ Progress        │ Real-time feedback
└─────────────────┘

Download: Backend → Client
┌─────────────────┐
│ CDN Cache       │ <100ms delivery
│ Compression     │ Optimized size
│ Parallel DL     │ Multiple streams
└─────────────────┘
```

## Error Handling Flow

### Client-Side Errors
```
User Action
    │
    ▼
┌─────────────────┐
│ Validation      │ ────┐
│ - File type     │     │ FAIL
│ - File size     │     │
│ - Format        │     │
└─────────┬───────┘     │
          │ PASS         │
          ▼              ▼
┌─────────────────┐  ┌─────────────────┐
│ Processing      │  │ Error Display   │
│ - Crop/Compress │  │ - User friendly │
│ - Preview       │  │ - Retry option  │
└─────────┬───────┘  │ - Clear action  │
          │ SUCCESS   └─────────────────┘
          ▼
    Upload Ready
```

### Backend Errors
```
Request Received
    │
    ▼
┌─────────────────┐
│ Request Valid?  │ ───NO──▶ 400 Bad Request
└─────────┬───────┘
          │ YES
          ▼
┌─────────────────┐
│ File Valid?     │ ───NO──▶ 422 Invalid File
└─────────┬───────┘
          │ YES
          ▼
┌─────────────────┐
│ Process Image   │ ───FAIL─▶ 500 Process Error
└─────────┬───────┘
          │ SUCCESS
          ▼
    200 Success
```

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: 'INVALID_FILE' | 'TOO_LARGE' | 'PROCESS_FAILED' | 'RATE_LIMITED';
    message: string;
    details?: {
      maxSize?: number;
      allowedTypes?: string[];
      retryAfter?: number;
    };
  };
}
```

## Security Data Flow

### Input Sanitization
```
Raw File Input
    │
    ▼
┌─────────────────┐
│ Type Validation │ ← Check MIME type
│ Size Validation │ ← Check file size  
│ Magic Bytes     │ ← Verify real format
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Content Scan    │ ← Malware check
│ Metadata Strip  │ ← Remove EXIF data
│ Format Convert  │ ← Standardize format
└─────────┬───────┘
          │
          ▼
    Safe File
```

### Privacy Protection
```
┌─────────────────┐
│ Client Process  │ ← No server upload needed
│ Temp Storage    │ ← Memory only, no disk
│ Auto Cleanup    │ ← Immediate disposal
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ No Persistence  │ ← No permanent storage
│ Secure Transit  │ ← HTTPS only
│ Short-lived URL │ ← Download expires
└─────────────────┘
```

## Performance Metrics

### Target Performance Goals
```typescript
interface PerformanceTargets {
  clientProcessing: {
    cropPreview: '<100ms';
    compression: '<500ms';
    upload: '<2s for 5MB';
  };
  backend: {
    requestValidation: '<10ms';
    faceDetection: '<800ms';
    backgroundRemoval: '<1.5s';
    sharpProcessing: '<300ms';
    complianceCheck: '<100ms';
    responseGeneration: '<100ms';
  };
  endToEnd: {
    uploadToProcessedDownload: '<5s';
    errorRecovery: '<1s';
  };
}
```

### Monitoring Points
```
Frontend Metrics:
├── File selection time
├── Processing duration
├── Upload progress
├── Error frequency
└── User abandonment

Backend Metrics:
├── Request latency
├── Face detection time
├── Background removal time  
├── Sharp processing time
├── Compliance validation time
├── Memory usage (AI models)
├── GPU utilization
├── Error rates by stage
├── Model cache hit rates
└── Throughput by country
```

## Data Lifecycle

### 1. Temporary Data (Client)
- **Location**: Browser memory/canvas
- **Duration**: Until upload completion
- **Cleanup**: Automatic on page reload/close

### 2. Processing Data (Server)
- **Location**: Server memory (no disk)
- **Duration**: During request processing only
- **Cleanup**: Immediate after response

### 3. Output Data (CDN)
- **Location**: CDN edge servers
- **Duration**: 24 hours maximum
- **Cleanup**: Automatic expiration

### 4. No Permanent Storage
- **User photos**: Never stored permanently
- **Metadata**: Minimal, anonymized analytics only
- **Compliance**: GDPR/privacy-first approach

This data flow design prioritizes **performance**, **privacy**, and **reliability** while maintaining a simple, understandable architecture that can scale efficiently.