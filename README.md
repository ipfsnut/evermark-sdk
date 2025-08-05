# Evermark SDK

A TypeScript SDK for robust image handling with intelligent fallbacks and storage orchestration. Built specifically for blockchain-based content systems that need reliable image display across multiple storage providers.

## 🎯 Problem Statement

Displaying images in modern web applications is complex when you have:
- **Multiple storage sources** (Supabase, IPFS, CDNs)
- **Network reliability issues** 
- **CORS authentication** requirements
- **Performance optimization** needs
- **Automatic fallback strategies** for failed loads

This SDK provides battle-tested solutions for these challenges in a single, unified package.

## 🚀 Quick Start

### Installation
```bash
npm install evermark-sdk
# or
yarn add evermark-sdk
# or  
pnpm add evermark-sdk
```

### Basic Usage
```typescript
import { resolveImageSources } from 'evermark-sdk';

// Input from your evermark data
const sources = resolveImageSources({
  supabaseUrl: 'https://supabase.storage.com/image.jpg',
  thumbnailUrl: 'https://supabase.storage.com/thumb.jpg', 
  ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
});

console.log('Sources to try:', sources);
// Returns prioritized array of image sources with intelligent fallbacks
```

## 📦 What's Included

### Core Functions
- **`resolveImageSources()`** - Smart source prioritization and fallback logic
- **`ImageLoader`** - Browser image loading with retries and CORS handling
- **`StorageOrchestrator`** - Automatic IPFS → Supabase transfer flow
- **React Components** - `EvermarkImage`, `ImageDisplay`, `ImageUpload`
- **React Hooks** - `useImageLoader`, `useStorageFlow`, `useImageUpload`

### 3-Step Storage Flow
The SDK implements an intelligent 3-step process:

1. **Check Supabase** - Try loading from Supabase Storage first
2. **Auto-Transfer** - If missing, automatically transfer from IPFS to Supabase  
3. **Graceful Fallback** - Fall back to thumbnails or alternative sources

```typescript
import { EnhancedImageLoader } from 'evermark-sdk';

const loader = new EnhancedImageLoader({
  autoTransfer: true,
  storageConfig: {
    supabase: {
      url: 'https://your-project.supabase.co',
      anonKey: 'your-anon-key',
      bucketName: 'images'
    },
    ipfs: {
      gateway: 'https://gateway.pinata.cloud/ipfs'
    }
  }
});

const result = await loader.loadImageWithStorageFlow({
  supabaseUrl: 'https://supabase.co/storage/image.jpg',
  ipfsHash: 'QmHash...'
});
```

## ⚛️ React Integration

### Simple Image Display
```typescript
import { EvermarkImage } from 'evermark-sdk';

function MyComponent({ evermark }) {
  return (
    <EvermarkImage
      evermark={evermark}
      variant="hero"
      enableAutoTransfer={true}
      storageConfig={storageConfig}
    />
  );
}
```

### Custom Hook Usage
```typescript
import { useImageLoader } from 'evermark-sdk';

function CustomImage({ evermark }) {
  const { imageUrl, isLoading, hasError, retry } = useImageLoader({
    supabaseUrl: evermark.supabaseImageUrl,
    ipfsHash: evermark.ipfsHash,
    thumbnailUrl: evermark.thumbnailUrl
  });

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <button onClick={retry}>Retry</button>;
  return <img src={imageUrl} alt={evermark.title} />;
}
```

### Storage Operations
```typescript
import { useStorageFlow } from 'evermark-sdk';

function TransferComponent({ ipfsHash }) {
  const { status, progress, startFlow } = useStorageFlow({
    storageConfig,
    autoStart: false
  });

  return (
    <div>
      <button onClick={() => startFlow({ ipfsHash })}>
        Transfer to Supabase
      </button>
      {progress && <div>Progress: {progress.percentage}%</div>}
    </div>
  );
}
```

## 🔧 Configuration

### Storage Configuration
```typescript
import { createStorageOrchestrator } from 'evermark-sdk';

const orchestrator = createStorageOrchestrator(
  'https://your-project.supabase.co',
  'your-anon-key',
  'your-bucket-name',
  existingSupabaseClient // optional
);
```

### Advanced Image Loading
```typescript
import { ImageLoader } from 'evermark-sdk';

const loader = new ImageLoader({
  maxRetries: 3,
  timeout: 10000,
  useCORS: true,
  debug: true
});
```

## 🏗️ Architecture

### Unified Package Structure
```
evermark-sdk/
├── core/           # Pure TypeScript logic, zero dependencies
├── browser/        # Browser-specific image loading & CORS
├── storage/        # Supabase + IPFS orchestration
└── react/          # React hooks and components
```

### Key Design Principles
- **Zero external dependencies** in core logic
- **Intelligent fallbacks** for network issues
- **TypeScript strict mode** throughout
- **Real data sources** - no mocks or placeholders
- **Existing client support** - works with your Supabase setup

## 📚 API Reference

### Core Types
```typescript
interface ImageSourceInput {
  supabaseUrl?: string;
  thumbnailUrl?: string;
  ipfsHash?: string;
  processedUrl?: string;
  externalUrls?: string[];
  preferThumbnail?: boolean;
}

interface StorageConfig {
  supabase: {
    url: string;
    anonKey: string;
    bucketName?: string;
    client?: SupabaseClient; // Use existing client
  };
  ipfs: {
    gateway: string;
    fallbackGateways?: string[];
    timeout?: number;
  };
}
```

### Core Functions
- `resolveImageSources(input, config?)` - Main source resolution
- `isValidUrl(url)` - URL validation
- `isValidIpfsHash(hash)` - IPFS hash validation  
- `createIpfsUrl(hash, gateway?)` - IPFS URL generation
- `createDefaultStorageConfig()` - Quick config setup

## 🧪 Error Handling

The SDK provides comprehensive error handling with detailed debugging:

```typescript
import { useImageLoader } from 'evermark-sdk';

const { imageUrl, hasError, error, attempts } = useImageLoader(sources, {
  debug: true // Enable detailed logging
});

// Access detailed failure information
if (hasError) {
  console.log('Failed attempts:', attempts);
  // Each attempt includes: url, success, error, timing
}
```

## 🚧 Migration from Monorepo

If you're migrating from the old `@evermark-sdk/*` packages:

```typescript
// Old (multiple packages)
import { resolveImageSources } from '@evermark-sdk/core';
import { ImageLoader } from '@evermark-sdk/browser';
import { EvermarkImage } from '@evermark-sdk/react';

// New (unified package)
import { 
  resolveImageSources, 
  ImageLoader, 
  EvermarkImage 
} from 'evermark-sdk';
```

## 🤝 Contributing

We welcome contributions! The codebase is organized for clarity:

1. **Core logic** in `/src/core` - Pure functions, no side effects
2. **Browser APIs** in `/src/browser` - DOM, fetch, CORS handling  
3. **Storage ops** in `/src/storage` - Supabase + IPFS integration
4. **React layer** in `/src/react` - Hooks and components

### Development
```bash
git clone https://github.com/ipfsnut/evermark-sdk.git
cd evermark-sdk
npm install
npm run build
npm test
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **GitHub**: https://github.com/ipfsnut/evermark-sdk
- **Issues**: https://github.com/ipfsnut/evermark-sdk/issues
- **NPM**: https://www.npmjs.com/package/evermark-sdk

---

**Built to solve real image loading challenges in decentralized applications. 🚀**