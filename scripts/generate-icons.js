/**
 * Generate PWA icons from SVG
 * 
 * This script requires sharp to be installed:
 * npm install --save-dev sharp
 * 
 * Usage: node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  try {
    // Import sharp
    let sharp;
    try {
      const sharpModule = await import('sharp');
      sharp = sharpModule.default;
    } catch (e) {
      console.error('❌ Error: sharp is not installed.');
      console.log('📦 Please install it first: npm install --save-dev sharp');
      console.log('\nAlternatively, you can use an online tool to convert icon.svg to PNG:');
      console.log('1. Open public/icon.svg in a browser or image editor');
      console.log('2. Export/resize to the following sizes:');
      console.log('   - pwa-64x64.png (64x64)');
      console.log('   - pwa-192x192.png (192x192)');
      console.log('   - pwa-512x512.png (512x512)');
      console.log('3. Save them in the public/ folder');
      process.exit(1);
    }

    const publicDir = path.join(__dirname, '..', 'public');
    const svgPath = path.join(publicDir, 'icon.svg');
    
    if (!fs.existsSync(svgPath)) {
      console.error('❌ Error: icon.svg not found in public folder');
      process.exit(1);
    }

    const sizes = [64, 192, 512];
    
    console.log('🎨 Generating PWA icons...\n');
    
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `pwa-${size}x${size}.png`);
      
      await sharp(svgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 3, g: 2, b: 19, alpha: 1 } // #030213
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated pwa-${size}x${size}.png`);
    }
    
    // Also generate apple-touch-icon and favicon
    const appleIconPath = path.join(publicDir, 'apple-touch-icon.png');
    await sharp(svgPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 3, g: 2, b: 19, alpha: 1 }
      })
      .png()
      .toFile(appleIconPath);
    console.log('✅ Generated apple-touch-icon.png');
    
    const faviconPath = path.join(publicDir, 'favicon.ico');
    // Note: sharp doesn't generate ICO directly, so we'll create a 32x32 PNG as favicon
    await sharp(svgPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 3, g: 2, b: 19, alpha: 1 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('✅ Generated favicon.png (rename to favicon.ico if needed)');
    
    console.log('\n✨ All icons generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Review the generated icons in public/');
    console.log('2. If satisfied, you can delete icon.svg (or keep it for future regenerations)');
    console.log('3. Run npm run build to test the PWA');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();

