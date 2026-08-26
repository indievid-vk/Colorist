import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

  const sourceIcon = path.join(rootDir, 'icon_512x512.png');
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon_512x512.png not found in project root');
    return;
  }

  const sizes = [
    { dir: publicDir, name: 'pwa-512.png', size: 512 },
    { dir: publicDir, name: 'icon_512.png', size: 512 },
    { dir: publicDir, name: 'icon_512x512.png', size: 512 },
    { dir: publicDir, name: 'pwa-256.png', size: 256 },
    { dir: publicDir, name: 'icon_256.png', size: 256 },
    { dir: publicDir, name: 'icon_256x256.png', size: 256 },
    { dir: publicDir, name: 'pwa-192.png', size: 192 },
    { dir: publicDir, name: 'icon_192.png', size: 192 },
    { dir: publicDir, name: 'icon_192x192.png', size: 192 },
    { dir: publicDir, name: 'apple-touch-icon.png', size: 180 },
    { dir: publicDir, name: 'favicon.png', size: 64 },
    { dir: publicDir, name: 'favicon.ico', size: 64 },
    { dir: srcAssetsDir, name: 'icon_512x512.png', size: 512 },
    { dir: srcAssetsDir, name: 'icon_192x192.png', size: 192 }
  ];

  for (const item of sizes) {
    const dest = path.join(item.dir, item.name);
    await sharp(sourceIcon)
      .resize(item.size, item.size)
      .png()
      .toFile(dest);
    console.log(`Generated: ${item.name} (${item.size}x${item.size})`);
  }
}

buildIcons().catch(console.error);
