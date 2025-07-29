# Evermark SDK

> **🚧 Work in Progress**: This monorepo is actively being developed to solve complex image display issues in blockchain-based content systems.

A TypeScript monorepo providing robust, tested image handling for content preservation applications. Built to solve the specific challenges of displaying images from multiple sources with intelligent fallbacks.

## 🎯 Problem Statement

Displaying images in modern web applications is complex when you have:
- **Multiple storage sources** (Supabase, IPFS, CDNs)
- **Network reliability issues** 
- **CORS authentication** requirements
- **Performance optimization** needs
- **Fallback strategies** for failed loads

This SDK provides battle-tested solutions for these challenges.

## 📦 Packages

### Core Packages
- **`@evermark-sdk/core`** - Pure TypeScript logic, zero dependencies
- **`@evermark-sdk/browser`** - Browser-specific image loading *(coming soon)*
- **`@evermark-sdk/react`** - React hooks and components *(coming soon)*

### Development Tools
- **`apps/test-app`** - Interactive testing environment *(coming soon)*
- **`tools/url-tester`** - CLI debugging tools *(coming soon)*

## 🚀 Quick Start

### Installation
```bash
npm install @evermark-sdk/core
# or
yarn add @evermark-sdk/core
# or  
pnpm add @evermark-sdk/core
```

### Basic Usage
```typescript
import { resolveImageSources } from '@evermark-sdk/core';

// Input from your evermark data
const sources = resolveImageSources({
  supabaseUrl: 'https://supabase.storage.com/image.jpg',
  thumbnailUrl: 'https://supabase.storage.com/thumb.jpg', 
  ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
});

console.log('Sources to try:', sources);
// [
//   { url: 'https://supabase.storage.com/image.jpg', type: 'primary', priority: 1 },
//   { url: 'https://supabase.storage.com/thumb.jpg', type: 'thumbnail', priority: 2 },
//   { url: 'https://gateway.pinata.cloud/ipfs/Qm...', type: 'fallback', priority: 3 }
// ]
```

### Advanced Configuration
```typescript
import { resolveImageSources, createMobileOptimizedResolver } from '@evermark-sdk/core';

// For mobile devices
const mobileResolver = createMobileOptimizedResolver();
const mobileSources = mobileResolver({
  supabaseUrl: 'https://example.com/image.jpg',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  preferThumbnail: true
});

// Custom configuration
const sources = resolveImageSources({
  supabaseUrl: 'https://example.com/image.jpg',
  ipfsHash: 'QmHash...'
}, {
  maxSources: 3,
  defaultTimeout: 5000,
  includeIpfs: false,
  mobileOptimization: true
});
```

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Getting Started
```bash
# Clone the repository
git clone https://github.com/ipfsnut/evermark-sdk.git
cd evermark-sdk

# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build all packages
pnpm build

# Start development mode
pnpm dev
```

### Package Development
```bash
# Work on core package
cd packages/core

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm type-check

# Build package
pnpm build
```

## 🧪 Testing Philosophy

This project emphasizes **comprehensive testing** to ensure reliability:

- **Unit tests** for pure functions (95%+ coverage required)
- **Integration tests** for cross-package compatibility  
- **Browser tests** for real-world scenarios
- **Performance tests** for optimization validation

### Running Tests
```bash
# All packages
pnpm test

# Specific package
cd packages/core && pnpm test

# With coverage report
pnpm test:coverage

# Watch mode for development
pnpm test:watch
```

## 📚 API Documentation

### Core Types
```typescript
interface ImageSource {
  url: string;
  type: 'primary' | 'thumbnail' | 'fallback' | 'placeholder';
  priority: number;
  timeout?: number;
  metadata?: {
    storageProvider?: 'supabase' | 'ipfs' | 'cdn' | 'external';
    size?: 'thumbnail' | 'medium' | 'large' | 'original';
    format?: 'jpg' | 'png' | 'gif' | 'webp' | 'svg';
  };
}

interface ImageSourceInput {
  supabaseUrl?: string;
  thumbnailUrl?: string;
  ipfsHash?: string;
  processedUrl?: string;
  externalUrls?: string[];
  preferThumbnail?: boolean;
  ipfsGateway?: string;
}
```

### Core Functions
- `resolveImageSources(input, config?)` - Main source resolution
- `isValidUrl(url)` - URL validation
- `isValidIpfsHash(hash)` - IPFS hash validation  
- `createIpfsUrl(hash, gateway?)` - IPFS URL generation
- `validateImageSources(sources)` - Source validation
- `filterSourcesByCondition(sources, condition)` - Conditional filtering

## 🔧 Integration Examples

### React Integration (Future)
```typescript
// Coming soon: @evermark-sdk/react
import { useImageLoader } from '@evermark-sdk/react';

function ImageComponent({ evermark }) {
  const { status, finalUrl, retry } = useImageLoader({
    supabaseUrl: evermark.supabaseImageUrl,
    thumbnailUrl: evermark.thumbnailUrl,
    ipfsHash: evermark.ipfsHash
  });

  if (status === 'loading') return <ImageSkeleton />;
  if (status === 'failed') return <RetryButton onClick={retry} />;
  return <img src={finalUrl} alt={evermark.title} />;
}
```

### Vue Integration (Future)
```typescript
// Community package potential
import { createImageLoader } from '@evermark-sdk/vue';

const { status, finalUrl, retry } = createImageLoader({
  supabaseUrl: props.evermark.supabaseImageUrl,
  thumbnailUrl: props.evermark.thumbnailUrl,
  ipfsHash: props.evermark.ipfsHash
});
```

## 🛣️ Roadmap

### Phase 1: Core Foundation ✅
- [x] Pure TypeScript image resolution logic
- [x] Comprehensive test suite
- [x] URL validation and IPFS handling
- [x] Source prioritization and filtering

### Phase 2: Browser Integration (Week 2)
- [ ] Browser-specific image loading
- [ ] CORS handling and authentication
- [ ] Performance monitoring
- [ ] Memory leak prevention

### Phase 3: React Integration (Week 3)  
- [ ] React hooks for image loading
- [ ] Component library
- [ ] State management integration
- [ ] Performance optimization

### Phase 4: Tooling & Publishing (Week 4)
- [ ] Interactive test application
- [ ] CLI debugging tools
- [ ] NPM publishing
- [ ] Documentation site

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Ensure all tests pass: `pnpm test`
5. Submit a pull request

### Code Standards
- **TypeScript strict mode** required
- **95%+ test coverage** for new code
- **ESLint + Prettier** for formatting
- **Conventional commits** for clear history

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **GitHub**: https://github.com/ipfsnut/evermark-sdk
- **Issues**: https://github.com/ipfsnut/evermark-sdk/issues
- **Discussions**: https://github.com/ipfsnut/evermark-sdk/discussions

---

**Built with ❤️ to solve real image loading challenges in decentralized applications.**