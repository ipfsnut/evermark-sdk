// test-core.js
// Run this with: node test-core.js

console.log('🧪 Testing Core SDK Functionality...\n');

async function testCore() {
  try {
    const { 
      resolveImageSources, 
      createDefaultStorageConfig,
      isValidUrl,
      isValidIpfsHash,
      createIpfsUrl
    } = await import('./packages/core/dist/index.js');

    console.log('1️⃣ Testing URL Resolution...');
    
    // Test your main use case
    const evermarkData = {
      supabaseUrl: 'https://example.supabase.co/storage/v1/object/public/images/test.jpg',
      thumbnailUrl: 'https://example.supabase.co/storage/v1/object/public/images/thumb.jpg',
      processedUrl: 'https://legacy.example.com/processed.jpg',
      ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
    };

    const sources = resolveImageSources(evermarkData);
    console.log('✅ Resolved', sources.length, 'image sources:');
    sources.forEach((source, i) => {
      console.log(`   ${i + 1}. ${source.type} (priority ${source.priority}): ${source.url.substring(0, 50)}...`);
    });

    // Test mobile optimization
    const mobileSources = resolveImageSources(evermarkData, { 
      preferThumbnail: true,
      maxSources: 2 
    });
    console.log('✅ Mobile optimized:', mobileSources.length, 'sources, thumbnail first');
    console.log('');

    console.log('2️⃣ Testing Validation Functions...');
    
    // Test URL validation
    console.log('✅ Valid URL check:', isValidUrl('https://example.com/image.jpg'));
    console.log('❌ Invalid URL check:', isValidUrl('not-a-url'));
    
    // Test IPFS validation
    console.log('✅ Valid IPFS hash:', isValidIpfsHash('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'));
    console.log('❌ Invalid IPFS hash:', isValidIpfsHash('invalid-hash'));
    
    // Test IPFS URL creation
    const ipfsUrl = createIpfsUrl('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
    console.log('✅ IPFS URL created:', ipfsUrl);
    console.log('');

    console.log('3️⃣ Testing Storage Configuration...');
    
    // Test storage config creation
    const config = createDefaultStorageConfig(
      'https://test.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'images'
    );
    
    console.log('✅ Storage config created:');
    console.log('   Supabase URL:', config.supabase.url);
    console.log('   Bucket:', config.supabase.bucketName);
    console.log('   IPFS Gateway:', config.ipfs.gateway);
    console.log('   Max file size:', config.upload.maxFileSize);
    console.log('');

    console.log('🎉 Core functionality tests passed!');
    
  } catch (error) {
    console.error('❌ Core test failed:', error.message);
    console.error(error.stack);
  }
}

testCore();