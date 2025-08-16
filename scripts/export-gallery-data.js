#!/usr/bin/env node

/**
 * Export Gallery Data Script
 * 
 * This script exports gallery data from the development database
 * and generates SQL commands to import into production.
 */

import { db } from '../server/db.js';
import { galleryImages } from '../shared/schema.js';
import fs from 'fs';
import path from 'path';

async function exportGalleryData() {
  try {
    console.log('🎨 Exporting gallery data from development database...');
    
    // Fetch all gallery images
    const images = await db.select().from(galleryImages);
    
    console.log(`📸 Found ${images.length} gallery images`);
    
    // Generate INSERT statements
    const insertStatements = images.map(img => {
      const values = [
        `'${img.id}'`,
        `'${img.imageUrl.replace(/'/g, "''")}'`, // Escape single quotes
        `'${img.title.replace(/'/g, "''")}'`,
        img.description ? `'${img.description.replace(/'/g, "''")}'` : 'NULL',
        `'${img.category}'`,
        `'${img.altText.replace(/'/g, "''")}'`,
        img.sortOrder,
        img.isVisible,
        `'${img.createdAt.toISOString()}'`
      ];
      
      return `INSERT INTO gallery_images (id, image_url, title, description, category, alt_text, sort_order, is_visible, created_at) VALUES (${values.join(', ')});`;
    });
    
    // Create the export file
    const exportContent = `-- Gallery Images Export
-- Generated on: ${new Date().toISOString()}
-- Total images: ${images.length}

-- Clear existing data (optional - only if you want to replace all data)
-- DELETE FROM gallery_images;

-- Insert gallery images
${insertStatements.join('\n')}

-- Verification query
SELECT COUNT(*) as total_imported FROM gallery_images;
`;
    
    const exportPath = path.join(process.cwd(), 'gallery-export.sql');
    fs.writeFileSync(exportPath, exportContent);
    
    console.log(`✅ Gallery data exported to: ${exportPath}`);
    console.log('\n📋 To import to production:');
    console.log('1. Connect to your production Neon database');
    console.log('2. Run the SQL commands from gallery-export.sql');
    console.log('3. Verify with: SELECT COUNT(*) FROM gallery_images;');
    
    // Also create a JSON backup
    const jsonPath = path.join(process.cwd(), 'gallery-backup.json');
    fs.writeFileSync(jsonPath, JSON.stringify(images, null, 2));
    console.log(`💾 JSON backup created: ${jsonPath}`);
    
  } catch (error) {
    console.error('❌ Error exporting gallery data:', error);
    process.exit(1);
  }
}

// Run the export
exportGalleryData();