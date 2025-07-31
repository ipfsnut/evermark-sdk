// test-imports.js
// Run this with: node test-imports.js

console.log('🧪 Testing Evermark SDK imports...\n');

async function testImports() {
  try {
    // Test Core package
    console.log('1️⃣ Testing Core package...');
    const core = await import('./packages/core/dist/index.js');
    console.log('✅ Core imports:', Object.keys(core));
    
    // Test basic core functionality
    const sources = core.resolveImageSources({
      supabaseUrl: 'https://example.supabase.co/image.jpg',
      ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
    });
    console.log('✅ Core functionality works - resolved', sources.length, 'sources\n');

    // Test Storage package  
    console.log('2️⃣ Testing Storage package...');
    const storage = await import('./packages/storage/dist/index.js');
    console.log('✅ Storage imports:', Object.keys(storage));
    
    // Test storage config creation
    const storageConfig = core.createDefaultStorageConfig(
      'https://test.supabase.co',
      'test-key',
      'images'
    );
    console.log('✅ Storage config created:', !!storageConfig.supabase);
    console.log('✅ Storage orchestrator can be created:', !!(new storage.StorageOrchestrator(storageConfig)));
    console.log('');

    // Test Browser package
    console.log('3️⃣ Testing Browser package...');
    const browser = await import('./packages/browser/dist/index.js');
    console.log('✅ Browser imports:', Object.keys(browser));
    
    // Test image loader creation
    const loader = browser.createImageLoader({ debug: true });
    console.log('✅ Image loader created:', !!loader);
    console.log('');

    // Test React package
    console.log('4️⃣ Testing React package...');
    const react = await import('./packages/react/dist/index.js');
    console.log('✅ React imports:', Object.keys(react));
    console.log('');

    console.log('🎉 All imports successful! SDK is working correctly.');
    
  } catch (error) {
    console.error('❌ Import test failed:', error.message);
    console.error(error.stack);
  }
}

testImports();