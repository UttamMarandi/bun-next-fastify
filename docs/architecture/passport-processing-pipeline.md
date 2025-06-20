# Passport Processing Pipeline

## Overview

This document details the backend AI processing pipeline that transforms user photos into compliant passport photos using **Sharp**, **face-api.js**, and **background removal AI**.

## Processing Pipeline Stages

### Stage 1: Face Detection & Analysis
```
Input Image
    │
    ▼
┌─────────────────┐
│ face-api.js     │
│ - Load models   │
│ - Detect faces  │
│ - Find landmarks│
│ - Measure dims  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Face Validation │
│ - Single face?  │
│ - Front facing? │
│ - Eye level OK? │
│ - Size correct? │
└─────────┬───────┘
          │
          ▼
    Face Analysis
```

**face-api.js Models Used:**
- **SSD MobileNet**: Fast face detection
- **Face Landmark 68**: Precise facial landmarks
- **Face Recognition**: Face orientation analysis

### Stage 2: Auto-Cropping & Positioning
```
Face Analysis
    │
    ▼
┌─────────────────┐
│ Calculate Crop  │
│ - Eye line pos  │
│ - Face center   │
│ - Margins       │
│ - Country specs │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Sharp Crop      │
│ - Precise cut   │
│ - Quality maint │
│ - Memory effic  │
└─────────┬───────┘
          │
          ▼
   Cropped Image
```

**Country-Specific Positioning:**
```typescript
// Example: US Passport requirements
const US_PASSPORT_SPEC: CountryPassportSpec = {
  code: 'US',
  name: 'United States',
  requirements: {
    dimensions: {
      width: 51,    // 2 inches
      height: 51,   // 2 inches  
      unit: 'mm',
      dpi: 300
    },
    faceRequirements: {
      heightPercent: 69,     // Face 69% of image height
      positionFromTop: 50,   // Face center at 50%
      eyeLevel: 35,          // Eyes at 35% from top
      margins: {
        top: 6,     // 6mm from top of head
        bottom: 6,  // 6mm to bottom
        sides: 6    // 6mm on each side
      }
    },
    background: {
      color: '#FFFFFF',
      uniformity: true,
      shadows: false
    }
  }
};
```

### Stage 3: Traditional Background Removal
```
Cropped Image
    │
    ▼
┌─────────────────┐
│ Color Analysis  │
│ - HSV convert   │
│ - Chroma detect │
│ - Threshold calc│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Edge Detection  │
│ - Canny edges   │
│ - Contour find  │
│ - Morphological │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Background Fill │
│ - Flood fill    │
│ - White replace │
│ - Edge blend    │
└─────────┬───────┘
          │
          ▼
  Clean Cutout
```

**Traditional Background Removal Options:**

1. **Chroma Key Detection**
   - Best for: Green/blue screen setups
   - Library: Sharp + custom HSV analysis
   - Accuracy: 95%+ with controlled backgrounds

2. **Edge Detection + Flood Fill**
   - Best for: High contrast subjects
   - Library: OpenCV.js
   - Accuracy: 85-90% with clear boundaries

3. **Luminance Segmentation**
   - Best for: Studio lighting conditions
   - Library: Sharp + Jimp
   - Accuracy: 80-85% with proper lighting

4. **Template Matching**
   - Best for: Standardized photo booth setups
   - Library: OpenCV.js template matching
   - Accuracy: 95%+ with known backgrounds

### Stage 4: Sharp Image Enhancement
```
Clean Cutout
    │
    ▼
┌─────────────────┐
│ Sharp Resize    │
│ - Country dims  │
│ - High quality  │
│ - Lanczos algo  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Color Correction│
│ - White balance │
│ - Skin tone     │
│ - Contrast      │
│ - Saturation    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Quality Enhance │
│ - Sharpening    │
│ - Noise reduce  │
│ - DPI setting   │
│ - Compression   │
└─────────┬───────┘
          │
          ▼
  Final Passport Photo
```

## Country Specifications Database

### Supported Countries
```typescript
const PASSPORT_SPECS: Record<CountryCode, CountryPassportSpec> = {
  'US': {
    code: 'US',
    name: 'United States',
    requirements: {
      dimensions: { width: 51, height: 51, unit: 'mm', dpi: 300 },
      faceRequirements: {
        heightPercent: 69,
        positionFromTop: 50,
        eyeLevel: 35,
        margins: { top: 6, bottom: 6, sides: 6 }
      },
      background: { color: '#FFFFFF', uniformity: true, shadows: false }
    }
  },
  
  'UK': {
    code: 'UK', 
    name: 'United Kingdom',
    requirements: {
      dimensions: { width: 45, height: 35, unit: 'mm', dpi: 300 },
      faceRequirements: {
        heightPercent: 70,
        positionFromTop: 50,
        eyeLevel: 32,
        margins: { top: 4, bottom: 4, sides: 4 }
      },
      background: { color: '#F5F5F5', uniformity: true, shadows: false }
    }
  },

  'IN': {
    code: 'IN',
    name: 'India', 
    requirements: {
      dimensions: { width: 51, height: 51, unit: 'mm', dpi: 300 },
      faceRequirements: {
        heightPercent: 70,
        positionFromTop: 50, 
        eyeLevel: 35,
        margins: { top: 6, bottom: 6, sides: 6 }
      },
      background: { color: '#FFFFFF', uniformity: true, shadows: false }
    }
  },

  'CA': {
    code: 'CA',
    name: 'Canada',
    requirements: {
      dimensions: { width: 50, height: 70, unit: 'mm', dpi: 300 },
      faceRequirements: {
        heightPercent: 72,
        positionFromTop: 45,
        eyeLevel: 30,
        margins: { top: 6, bottom: 12, sides: 6 }
      },
      background: { color: '#FFFFFF', uniformity: true, shadows: false }
    }
  },

  'AU': {
    code: 'AU', 
    name: 'Australia',
    requirements: {
      dimensions: { width: 45, height: 35, unit: 'mm', dpi: 300 },
      faceRequirements: {
        heightPercent: 68,
        positionFromTop: 50,
        eyeLevel: 34,
        margins: { top: 5, bottom: 5, sides: 5 }
      },
      background: { color: '#FFFFFF', uniformity: true, shadows: false }
    }
  }
};
```

### Compliance Validation
```typescript
interface ComplianceCheck {
  checkFaceSize(face: FaceDetectionResult, spec: CountryPassportSpec): boolean;
  checkFacePosition(face: FaceDetectionResult, spec: CountryPassportSpec): boolean;
  checkBackground(image: Buffer, spec: CountryPassportSpec): boolean;
  checkQuality(image: Buffer, spec: CountryPassportSpec): boolean;
  checkDimensions(image: Buffer, spec: CountryPassportSpec): boolean;
  
  generateComplianceReport(
    image: Buffer, 
    face: FaceDetectionResult, 
    spec: CountryPassportSpec
  ): PassportCompliance;
}
```

## AI Models & Libraries

### face-api.js Configuration
```typescript
// Model loading strategy
const FACE_API_CONFIG = {
  models: {
    ssdMobilenetv1: '/models/ssd_mobilenetv1_model-weights_manifest.json',
    faceLandmark68Net: '/models/face_landmark_68_model-weights_manifest.json', 
    faceRecognitionNet: '/models/face_recognition_model-weights_manifest.json'
  },
  options: {
    inputSize: 512,
    scoreThreshold: 0.5,
    minConfidence: 0.8
  }
};

// Face detection pipeline
async function detectFace(imageBuffer: Buffer): Promise<FaceDetectionResult> {
  const img = await canvas.loadImage(imageBuffer);
  const detections = await faceapi
    .detectAllFaces(img, new faceapi.SsdMobilenetv1Options(FACE_API_CONFIG.options))
    .withFaceLandmarks()
    .withFaceDescriptors();
    
  return processDetections(detections);
}
```

### Traditional Background Removal Implementation

```typescript
// Fastify server background removal options
interface BackgroundRemovalConfig {
  method: 'chroma' | 'edge' | 'luminance' | 'template';
  chromaKey?: {
    hue: number;        // Target hue (120 for green, 240 for blue)
    tolerance: number;  // Color tolerance (0-100)
    saturation: number; // Min saturation threshold
  };
  edgeDetection?: {
    cannyLow: number;   // Lower Canny threshold
    cannyHigh: number;  // Upper Canny threshold
    kernelSize: number; // Morphological kernel size
  };
  luminance?: {
    threshold: number;  // Luminance threshold (0-255)
    contrast: number;   // Contrast enhancement factor
  };
}

// Chroma key background removal
async function chromaKeyRemoval(
  imageBuffer: Buffer, 
  config: BackgroundRemovalConfig['chromaKey']
): Promise<Buffer> {
  return sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      // Convert RGB to HSV and detect chroma key color
      const processedData = removeChromaBackground(data, info, config);
      return sharp(processedData, { 
        raw: { width: info.width, height: info.height, channels: 4 } 
      })
      .png()
      .toBuffer();
    });
}

// Edge detection background removal
async function edgeDetectionRemoval(
  imageBuffer: Buffer,
  config: BackgroundRemovalConfig['edgeDetection']
): Promise<Buffer> {
  // Use OpenCV.js for edge detection
  const cv = require('opencv.js'); // opencv4nodejs alternative
  
  return new Promise((resolve) => {
    const img = cv.imread(imageBuffer);
    
    // Apply Canny edge detection
    const edges = new cv.Mat();
    cv.Canny(img, edges, config.cannyLow, config.cannyHigh);
    
    // Find contours and create mask
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    // Create background mask and apply
    const mask = createBackgroundMask(contours, img.size());
    const result = applyBackgroundMask(img, mask);
    
    // Convert back to buffer
    resolve(cv.imencode('.png', result));
  });
}

// Luminance-based segmentation
async function luminanceSegmentation(
  imageBuffer: Buffer,
  config: BackgroundRemovalConfig['luminance']
): Promise<Buffer> {
  return sharp(imageBuffer)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      // Apply Otsu's thresholding or fixed threshold
      const mask = createLuminanceMask(data, config.threshold);
      return sharp(imageBuffer)
        .composite([{ input: mask, blend: 'dest-in' }])
        .png()
        .toBuffer();
    });
}
```

### Sharp Configuration
```typescript
// Sharp optimization settings
const SHARP_CONFIG = {
  jpeg: {
    quality: 95,
    progressive: true,
    mozjpeg: true
  },
  resize: {
    kernel: sharp.kernel.lanczos3,
    fit: 'cover',
    position: 'center'
  },
  color: {
    space: 'srgb'
  }
};

// Enhanced image processing pipeline with traditional background removal
async function processWithSharp(
  imageBuffer: Buffer,
  spec: CountryPassportSpec,
  bgRemovalConfig?: BackgroundRemovalConfig
): Promise<Buffer> {
  let processedImage = imageBuffer;
  
  // Apply traditional background removal if requested
  if (bgRemovalConfig) {
    switch (bgRemovalConfig.method) {
      case 'chroma':
        processedImage = await chromaKeyRemoval(processedImage, bgRemovalConfig.chromaKey);
        break;
      case 'edge':
        processedImage = await edgeDetectionRemoval(processedImage, bgRemovalConfig.edgeDetection);
        break;
      case 'luminance':
        processedImage = await luminanceSegmentation(processedImage, bgRemovalConfig.luminance);
        break;
    }
  }
  
  return sharp(processedImage)
    .resize(
      mmToPixels(spec.requirements.dimensions.width, spec.requirements.dimensions.dpi),
      mmToPixels(spec.requirements.dimensions.height, spec.requirements.dimensions.dpi),
      SHARP_CONFIG.resize
    )
    .jpeg(SHARP_CONFIG.jpeg)
    .toColorspace(SHARP_CONFIG.color.space)
    .toBuffer();
}
```

## Performance Optimizations

### Model Caching Strategy
```typescript
class AIModelCache {
  private static faceApiModels: Map<string, any> = new Map();
  private static backgroundModels: Map<string, any> = new Map();
  
  static async preloadModels(): Promise<void> {
    // Load face-api.js models into memory
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    
    // Cache background removal models
    // Preload for instant processing
  }
  
  static getCachedModel(type: 'face' | 'background'): any {
    return this.faceApiModels.get(type);
  }
}
```

### Processing Queue
```typescript
interface ProcessingJob {
  id: string;
  imageBuffer: Buffer;
  country: CountryCode;
  priority: 'low' | 'normal' | 'high';
  startedAt?: Date;
  estimatedCompletion?: Date;
}

class ProcessingQueue {
  private jobs: ProcessingJob[] = [];
  private workers: number = 4; // CPU cores
  
  async addJob(job: ProcessingJob): Promise<string> {
    this.jobs.push(job);
    this.processNext();
    return job.id;
  }
  
  private async processNext(): Promise<void> {
    // Parallel processing with worker pools
    // Priority queue management
    // Resource allocation
  }
}
```

This enhanced processing pipeline provides professional-grade passport photo generation with AI-powered features and country-specific compliance validation.