#!/usr/bin/env node

/**
 * Check Production Gallery Status
 * Quick script to verify gallery state in production
 */

const { db } = require('../server/db.ts');
const { galleryImages } = require('../shared/schema.ts');

async function checkGalleryStatus() {
  try {
    console.log('🔍 Checking production gallery status...');
    
    const images = await db.select().from(galleryImages);
    console.log(`📊 Total gallery images: ${images.length}`);
    
    if (images.length === 0) {
      console.log('❌ No gallery images found in production database!');
      console.log('💡 Run: node scripts/seed-gallery-production.js');
      return false;
    }

    // Group by category
    const categories = {};
    images.forEach(img => {
      categories[img.category] = (categories[img.category] || 0) + 1;
    });

    console.log('📈 Images by category:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} images`);
    });

    // Check image types
    const objectStorageCount = images.filter(img => img.imageUrl.startsWith('/objects/')).length;
    const externalUrlCount = images.filter(img => img.imageUrl.startsWith('https://')).length;
    
    console.log('🔗 Image sources:');
    console.log(`  Object Storage: ${objectStorageCount}`);
    console.log(`  External URLs: ${externalUrlCount}`);

    console.log('✅ Gallery status check complete');
    return true;

  } catch (error) {
    console.error('❌ Error checking gallery:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  checkGalleryStatus()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Gallery check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkGalleryStatus };