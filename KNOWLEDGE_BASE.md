# База Знаний: Стандарты разработки и публикации PWA («Индивид СтудИИя»)

Данный документ фиксирует эталонную архитектуру, протокол предотвращения повреждения PNG-иконок при синхронизации с GitHub и полный чеклист автономных PWA-приложений.

---

## 1. Решение проблемы повреждения PNG-иконок при GitHub Sync

### 🔍 Первопричина проблемы
1. **Line Ending Normalization (CRLF ↔ LF в Git)**: Если Git при передаче воспринимает сжатый бинарный файл PNG как текст, он заменяет байты переноса строк `0x0D 0x0A` на `0x0A`. Это разрушает заголовок PNG (`\x89PNG\r\n\x1a\n`), делая файл невалидным. Браузер отклоняет битое изображение, в интерфейсе появляется значок ошибки, а системный диалог PWA заменяется на обычный ярлык с буквой «G».
2. **Абсолютные пути в подпапках GitHub Pages**: Использование `/icon.png` вместо `./icon.png` или динамического импорта Vite приводит к ошибке 404 на URL вида `username.github.io/repo-name/`.
3. **Несоответствие физических пикселей заголовкам**: Если в манифесте заявлен размер `192x192`, а в файле лежит `512x512`, движок Chromium бракует иконку для установки на экран.

---

### 🛡️ Эталонное решение (Трёхуровневая защита)

#### 1. Защита бинарников в `.gitattributes`
В корне проекта обязательно создается файл `.gitattributes`:
```gitattributes
* text=auto
*.png binary
*.jpg binary
*.jpeg binary
*.webp binary
*.svg binary
*.ico binary
*.ttf binary
*.woff binary
*.woff2 binary
```

#### 2. Генератор иконок на этапе сборки (`build-icons.js` + `sharp`)
В репозитории хранится один мастер-исходник `icon_512x512.png`. При каждой сборке (`npm run build`), в том числе внутри виртуальной машины GitHub Actions, скрипт `build-icons.js` программно нарезает свежие, чистые бинарные PNG всех размеров:

```javascript
// build-icons.js
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function buildIcons() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const srcAssetsDir = path.join(rootDir, 'src', 'assets');
  
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(srcAssetsDir)) fs.mkdirSync(srcAssetsDir, { recursive: true });

  let sourceIcon = path.join(rootDir, 'icon_512x512.png');
  if (!fs.existsSync(sourceIcon)) sourceIcon = path.join(srcAssetsDir, 'icon_512x512.png');
  if (!fs.existsSync(sourceIcon)) sourceIcon = path.join(publicDir, 'icon_512x512.png');

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
      .png({ compressionLevel: 9, quality: 100 })
      .toFile(dest);
    console.log(`Generated: ${path.relative(rootDir, dest)} (${item.size}x${item.size})`);
  }
}

buildIcons().catch(console.error);
```

#### 3. Встраивание в скрипты `package.json`
```json
{
  "scripts": {
    "generate-icons": "node build-icons.js",
    "build": "node build-icons.js && vite build"
  },
  "devDependencies": {
    "sharp": "^0.33.5"
  }
}
```

#### 4. Импорт через сборщик Vite в React-компонентах
Вместо небезопасных строк `<img src="./icon_512x512.png" />`, импортируйте картинку через Vite:
```tsx
import appIcon from '../assets/icon_512x512.png';

export const AppLogo = () => (
  <img src={appIcon} alt="App Logo" className="w-10 h-10 object-cover" />
);
```
Vite сформирует уникальный хешированный URL вида `assets/icon_512x512-[hash].png`, который кэшируется браузером на 100% и никогда не дает сбоев.

---

## 2. Конфигурация PWA (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './', // Обязательно для GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.ico',
        'favicon.png',
        'apple-touch-icon.png',
        'icon_192x192.png',
        'icon_256x256.png',
        'icon_512x512.png',
        'icon.svg'
      ],
      manifest: {
        id: './',
        name: 'Название приложения',
        short_name: 'Имя',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icon_192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon_192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icon_256x256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon_512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon_512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,ttf,woff,woff2,json,webmanifest}'],
        navigateFallback: 'index.html'
      }
    })
  ]
});
```

---

## 3. Автоматический деплой GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
name: Deploy PWA to GitHub Pages

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build PWA (Generates binary icons and compiles bundle)
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 4. Обязательные PWA-механики в проекте
1. **Перехват `beforeinstallprompt`** в `index.html` и передача в React-компонент `InstallPrompt`.
2. **Адаптивная карточка установки для iOS**: Пошаговая подсказка «Поделиться ➔ На экран Домой» для Safari на iPhone/iPad.
3. **Модальное окно первого запуска (WelcomeModal)** с анимацией конфетти (`canvas-confetti`).
4. **Компонент `AppLogo` с безопасным fallback**: Защищает от вывода пустых рамок и битых изображений в UI.
5. **Поддержка Offline-first**: Сервис-воркер кэширует шрифты, стили, бандл и данные для полноценной автономной работы.
