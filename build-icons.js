import fs from 'fs';
import path from 'path';

async function buildIcons() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const srcAssetsDir = path.join(rootDir, 'src', 'assets');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(srcAssetsDir)) {
    fs.mkdirSync(srcAssetsDir, { recursive: true });
  }

  // Check master source
  let sourceIcon = path.join(rootDir, 'icon_512x512.png');
  if (!fs.existsSync(sourceIcon)) {
    sourceIcon = path.join(srcAssetsDir, 'icon_512x512.png');
  }
  if (!fs.existsSync(sourceIcon)) {
    sourceIcon = path.join(publicDir, 'icon_512x512.png');
  }
  
  if (!fs.existsSync(sourceIcon)) {
    console.warn('Source icon_512x512.png not found. Using pre-existing icons in public/.');
    return;
  }

  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default || sharpModule;

    console.log('Generating RGBA PWA icons from:', sourceIcon);

    const targets = [
      { dir: publicDir, name: 'icon_512x512.png', size: 512 },
      { dir: publicDir, name: 'icon_512.png', size: 512 },
      { dir: publicDir, name: 'pwa-512.png', size: 512 },
      { dir: publicDir, name: 'icon_256x256.png', size: 256 },
      { dir: publicDir, name: 'icon_256.png', size: 256 },
      { dir: publicDir, name: 'pwa-256.png', size: 256 },
      { dir: publicDir, name: 'icon_192x192.png', size: 192 },
      { dir: publicDir, name: 'icon_192.png', size: 192 },
      { dir: publicDir, name: 'pwa-192.png', size: 192 },
      { dir: publicDir, name: 'apple-touch-icon.png', size: 180 },
      { dir: publicDir, name: 'favicon.ico', size: 64 },
      { dir: publicDir, name: 'favicon.png', size: 64 },
      { dir: srcAssetsDir, name: 'icon_512x512.png', size: 512 },
      { dir: srcAssetsDir, name: 'icon_192x192.png', size: 192 }
    ];

    for (const item of targets) {
      const dest = path.join(item.dir, item.name);
      await sharp(sourceIcon)
        .resize(item.size, item.size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
          palette: false,
          compressionLevel: 6,
          adaptiveFiltering: true,
          force: true
        })
        .toFile(dest);
      console.log(`Generated RGBA: ${path.relative(rootDir, dest)} (${item.size}x${item.size})`);
    }

    console.log('All PWA icons successfully generated as true 32-bit RGBA PNG.');
  } catch (err) {
    console.warn('Note: Sharp icon dynamic generation skipped, using pre-built icons:', err.message);
  }
}

buildIcons().then(() => {
  process.exit(0);
}).catch((err) => {
  console.warn('buildIcons encountered an error:', err);
  process.exit(0);
});
