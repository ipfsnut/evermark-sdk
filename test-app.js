// test-app.tsx
// Simple React app to test your components

import React from 'react';
import { createRoot } from 'react-dom/client';
import { EvermarkImage, ImageDisplay } from './packages/react/dist/index.js';

// Test data that mimics your evermark structure
const testEvermark = {
  id: 'test-1',
  tokenId: 123,
  title: 'Test Evermark Image',
  contentType: 'URL',
  supabaseImageUrl: 'https://picsum.photos/400/300',
  thumbnailUrl: 'https://picsum.photos/200/150',
  ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
};

// Test storage config (won't actually work without real credentials)
const testStorageConfig = {
  supabase: {
    url: 'https://test.supabase.co',
    anonKey: 'test-key',
    bucketName: 'images'
  },
  ipfs: {
    gateway: 'https://gateway.pinata.cloud/ipfs',
    fallbackGateways: ['https://ipfs.io/ipfs']
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024,
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    generateThumbnails: true,
    thumbnailSize: { width: 400, height: 400 }
  }
};

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🧪 Evermark SDK Test App</h1>
      
      <h2>1️⃣ EvermarkImage Component</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        <div>
          <h3>Hero Variant</h3>
          <EvermarkImage
            evermark={testEvermark}
            variant="hero"
            storageConfig={testStorageConfig}
            onImageLoad={() => console.log('Hero image loaded')}
            onImageError={(error) => console.log('Hero image error:', error)}
          />
        </div>

        <div>
          <h3>Standard Variant</h3>
          <EvermarkImage
            evermark={testEvermark}
            variant="standard"
            onImageLoad={() => console.log('Standard image loaded')}
          />
        </div>

        <div>
          <h3>Compact Variant</h3>
          <EvermarkImage
            evermark={testEvermark}
            variant="compact"
            onImageLoad={() => console.log('Compact image loaded')}
          />
        </div>

        <div>
          <h3>List Variant</h3>
          <EvermarkImage
            evermark={testEvermark}
            variant="list"
            onImageLoad={() => console.log('List image loaded')}
          />
        </div>
      </div>

      <h2>2️⃣ ImageDisplay Component</h2>
      <div style={{ marginBottom: '40px' }}>
        <ImageDisplay
          sources={{
            supabaseUrl: 'https://picsum.photos/300/200',
            thumbnailUrl: 'https://picsum.photos/150/100'
          }}
          alt="Test image"
          style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
          onLoad={(url, fromCache) => console.log('ImageDisplay loaded:', { url, fromCache })}
          onError={(error) => console.log('ImageDisplay error:', error)}
          showDebugInfo={true}
        />
      </div>

      <h2>3️⃣ Test Results</h2>
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
        <p>✅ Components rendered without crashing</p>
        <p>🔍 Check browser console for load events</p>
        <p>📱 Try resizing window to test responsive behavior</p>
        <p>🖼️ Images should load with fallback handling</p>
      </div>
    </div>
  );
}

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
}