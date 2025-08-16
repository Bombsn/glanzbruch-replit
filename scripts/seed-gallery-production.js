#!/usr/bin/env node

/**
 * Emergency Gallery Production Seeding Script
 * Run this when production has no gallery images
 */

import { db } from '../server/db.js';
import { galleryImages } from '../shared/schema.js';

async function seedProductionGallery() {
  console.log('🎯 Emergency gallery seeding for production...');
  
  try {
    // Check current state
    const existing = await db.select().from(galleryImages);
    console.log(`📊 Current gallery images: ${existing.length}`);
    
    if (existing.length > 0) {
      console.log('✅ Gallery already has images, skipping seed');
      return;
    }

    console.log('🌱 Seeding essential gallery images...');
    
    // Seed essential gallery data - key representative images
    const essentialImages = [
      {
        id: 'afcaec57-21f3-4e10-acfd-c8be7cfb6ed5',
        imageUrl: 'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ibb1faa0db4b7dc79/version/1742542669/image.png',
        title: 'Silber und Bronze 1',
        description: 'Handgefertigtes Schmuckstück aus der Silber und Bronze Kollektion',
        category: 'silver-bronze',
        altText: 'Glanzbruch Silber und Bronze Schmuckstück 1',
        sortOrder: 0,
        isVisible: true,
        createdAt: new Date('2025-08-16T12:08:18.722Z')
      },
      {
        id: '722da487-1233-41cd-b141-9868926ccc2d',
        imageUrl: 'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i83c6934c1231c52e/version/1625409223/image.jpg',
        title: 'Haare, Asche, Blüten, etc. 1',
        description: 'Handgefertigtes Schmuckstück aus der Haare, Asche, Blüten, etc. Kollektion',
        category: 'nature',
        altText: 'Glanzbruch Haare, Asche, Blüten, etc. Schmuckstück 1',
        sortOrder: 0,
        isVisible: true,
        createdAt: new Date('2025-08-16T12:08:19.101Z')
      },
      {
        id: '65eab9a6-133f-4736-a9a3-ab3d401fa467',
        imageUrl: '/objects/gallery/bd53742a-f056-4c5c-bb92-af9c52c7b4cc',
        title: 'Object Storage Test',
        description: 'Test image stored in Object Storage',
        category: 'silver-bronze',
        altText: 'Glanzbruch Object Storage Test',
        sortOrder: 0,
        isVisible: true,
        createdAt: new Date('2025-08-16T13:13:50.525Z')
      }
    ];

    // Insert the essential images
    const results = await db.insert(galleryImages).values(essentialImages).returning();
    
    console.log(`✅ Seeded ${results.length} essential gallery images`);
    console.log('🚀 Gallery is now functional!');
    
    // Verify
    const final = await db.select().from(galleryImages);
    console.log(`📊 Final gallery count: ${final.length}`);

  } catch (error) {
    console.error('❌ Error seeding gallery:', error);
    process.exit(1);
  }
}

// Run the seeding
seedProductionGallery()
  .then(() => {
    console.log('🎉 Gallery seeding complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Gallery seeding failed:', error);
    process.exit(1);
  });