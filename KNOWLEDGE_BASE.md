# База Знаний: Стандарты разработки и публикации PWA («Индивид СтудИИя»)

Этот документ представляет собой полновесный стандарт и готовое руководство по реализации автономных, надёжных и отказоустойчивых **Progressive Web Applications (PWA)** с подходом **Offline-First**.

---

## 1. Командная архитектура «Индивид СтудИИя»

Для обеспечения высокого качества кода, дизайна и UX используется ролевая модель из 5 виртуальных специалистов:
1. **[AI Product Owner & BA]**: Интервьюирует пользователя, формирует User Stories, контролирует целостность ТЗ и соблюдение протокола безопасности.
2. **[AI Product Designer]**: Проектирует UX/CJM, создает дизайн-систему, адаптивные интерфейсы и микро-анимации.
3. **[AI Lead Developer]**: Пишет чистый, документированный TypeScript/React код, организует архитектуру и PWA-механики.
4. **[AI QA Engineer]**: Проверяет логику, эмулирует поведение на iOS/Android, тестирует оффлайн-режимы и граничные случаи.
5. **[AI DevOps]**: Отвечает за сборку, работу Service Worker, конфигурацию Workbox, CI/CD и деплой на GitHub Pages/Cloud Run.

---

## 2. ЭТАЛОННАЯ АРХИТЕКТУРА PWA (Universal PWA Implementation Guide)

### 2.1. Механика 1: Установка приложения (Android & iOS)

#### 2.1.1. Глобальный перехват `beforeinstallprompt` (до загрузки React)
Для того чтобы событие возможности установки приложения не было упущено во время гидратации или загрузки JS-бандла, перехватчик устанавливается в `index.html`:

```html
<!-- index.html -->
<script>
  window.deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa-prompt-available'));
  });
  
  window.addEventListener('appinstalled', () => {
    window.deferredPrompt = null;
    localStorage.setItem('pwaPromptedForever_v1', 'true');
  });
</script>
```

#### 2.1.2. Андроид: Автоматический вывод системного окна установки
При открытии приложения по ссылке в браузере Android, если системный эвент `beforeinstallprompt` доступен, автоматически появляется адаптивное модальное окно с кнопкой «Установить». При клике вызывается системный диалог установки Андроид:

```tsx
// Функция вызова системного промпта установки
const handleInstallClick = async () => {
  const promptEvent = deferredPrompt || (window as any).deferredPrompt;
  if (!promptEvent) return;
  
  try {
    setIsInstalling(true);
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Приложение успешно установлено');
      setShow(false);
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
      localStorage.setItem('pwaPromptedForever_v1', 'true');
    }
  } catch (err) {
    console.error('Install prompt error:', err);
  } finally {
    setIsInstalling(false);
  }
};
```

#### 2.1.3. iOS: Плавающая кнопка (FAB) и пошаговая инструкция
Поскольку iOS Safari не поддерживает стандартный JavaScript API `beforeinstallprompt`, для устройств Apple реализуется:
1. **Плавающая кнопка установки (FAB)**: Отображается в нижнем углу экрана со специальным импульсным индикатором.
2. **Инструкция для iOS**: При нажатии открывается аккуратный Bottom Sheet с наглядной пошаговой иллюстрацией:
   - Шаг 1: Нажмите кнопку **«Поделиться»** или **«Меню»** в браузере Safari/Chrome.
   - Шаг 2: Выберите пункт **«На экран "Домой"»** (Add to Home Screen).

---

### 2.2. Механика 2: Приветственное окно при первом запуске установленного PWA

#### 2.2.1. Надежное определение Standalone-режима
Приложение определяет, что оно запущено как установленный нативный PWA-клиент, а не во вкладке браузера:

```typescript
const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
  || (window.navigator as any).standalone 
  || document.referrer.includes('android-app://')
  || window.location.search.includes('mode=standalone');
```

#### 2.2.2. Однократный вывод приветственного модала с салютом
При первом открытии приложения в режиме Standalone запускается праздничный салют из конфетти (`canvas-confetti`) и отображается всплывающее окно:

```tsx
if (isStandalone) {
  const welcomeShown = localStorage.getItem('hasSeenWelcome') || localStorage.getItem('installed_welcome_shown');
  if (!welcomeShown) {
    setShowWelcomeInstalled(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }
}
```

---

### 2.3. Механика 3: Информационное окно «Приложение обновлено» (Без конфликта с оффлайном)

#### 2.3.1. Защита от повреждения оффлайн-кэша (`registerType: 'prompt'`)
**Главное правило**: Никогда не использовать `registerType: 'autoUpdate'` и `skipWaiting: true` в приложениях с тяжелым оффлайн-функционалом. В `vite.config.ts`:
```typescript
VitePWA({
  registerType: 'prompt',
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: false,
    clientsClaim: true
  }
})
```

#### 2.3.2. Полная изоляция от отсутствия интернета (Strict Online Guards)
Все проверки обновлений оборачиваются строгой проверкой сетевого подключения `navigator.onLine`. При оффлайне приложение не спамит сетевыми запросами.

---

### 2.4. Механика 4: Гарантированное оффлайн-открытие и работа PWA (Offline-First Architecture)

- **Полное прекэширование**: `navigateFallback: 'index.html'`, увеличение лимита `maximumFileSizeToCacheInBytes: 15 * 1024 * 1024` (15MB).
- **Автономность данных**: Локальное сохранение состояния через `localStorage` или Zustand `persist`.

---

### 2.5. Механика 5: Плавающая кнопка возврата прокрутки (Back-to-Top FAB)
Универсальное отслеживание скролла (`<main>` + `window`), плавная прокрутка (`behavior: 'smooth'`), высокий z-index (`z-50`) с безопасным отступом от нижних панелей.

---

### 2.6. Механика 6: Раздел «О приложении» (Кнопка `(i)` в шапке Header)
Информационное окно в Header с описанием ценности приложения, технологий PWA, оффлайн-доступа и кнопкой обратной связи `mailto:indievid.krd@gmail.com` с подписью «Создано нейрокомандой Индивид СтудИИя».

---

### 2.7. Механика 7: Обязательные PWA-иконки, защита от повреждения в Git и автогенерация (Master Icon + Sharp)

#### 2.7.1. Критическое требование стандарта установки PWA
Современные браузеры (Google Chrome, Safari, Edge, Android WebViews) **не вызывают событие установки `beforeinstallprompt` и блокируют возможность установки PWA**, если в манифесте (`manifest.json` / `vite.config.ts`) отсутствуют валидные иконки высокого разрешения:
- **Минимальный набор**: иконка со стороной 192x192 или 256x256 пикселей, а также 512x512 пикселей (в формате PNG или SVG).
- **Иконки рабочего стола и браузера**: `apple-touch-icon.png` (180x180) для iOS и `favicon.png` / `favicon.ico` для вкладки браузера.

#### 2.7.2. Почему ломаются PNG-иконки при синхронизации с GitHub (Root Causes):
1. **CRLF ↔ LF конвертация Git (Line Ending Normalization)**:
   По умолчанию Git пытается нормализовать окончания строк в файлах. Если Git ошибочно принимает сжатый бинарный файл PNG за текст, байты `0x0D 0x0A` (CRLF) заменяются на `0x0A` (LF). Это разрушает заголовок PNG (`\x89PNG\r\n\x1a\n`), файл становится невалидным, и браузер перестает распознавать PWA.
2. **Абсолютные пути на GitHub Pages**:
   Если в манифесте или `index.html` указать пути с ведущим слэшем `/icon_512.png` вместо относительного `./icon_512.png` или `icon_512.png`, в репозитории `username.github.io/my-repo/` браузер пытается загрузить иконку из корня домена `username.github.io/icon_512.png` и получает ошибку 404.
3. **Отсутствие в прекэше Workbox**:
   Если иконки не прописаны в `includeAssets` и `globPatterns` в `vite.config.ts`, они не кэшируются Service Worker и не отображаются в оффлайн-режиме.

#### 2.7.3. Трёхуровневое решение проблемы (Реализация в «Палитре вкусов»):

##### Уровень 1. Защита бинарников через `.gitattributes`
В корне проекта создаётся файл `.gitattributes`, который жестко указывает Git сохранять графику как чистый бинарный поток:
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

##### Уровень 2. Архитектура Master-исходника и генератора `build-icons.js`
В корне проекта хранится **один мастер-файл** высокого разрешения `icon_512x512.png`, а все дочерние размеры автоматически нарезаются утилитой `sharp` перед каждой сборкой:

```javascript
// build-icons.js
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function buildIcons() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sourceIcon = path.join(rootDir, 'icon_512x512.png');
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon_512x512.png not found');
    return;
  }

  const sizes = [
    { name: 'pwa-512.png', size: 512 },
    { name: 'icon_512.png', size: 512 },
    { name: 'pwa-256.png', size: 256 },
    { name: 'icon_256.png', size: 256 },
    { name: 'pwa-192.png', size: 192 },
    { name: 'icon_192.png', size: 192 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.png', size: 64 }
  ];

  for (const item of sizes) {
    const dest = path.join(publicDir, item.name);
    await sharp(sourceIcon)
      .resize(item.size, item.size)
      .png()
      .toFile(dest);
    console.log(`Generated: ${item.name} (${item.size}x${item.size})`);
  }
}

buildIcons().catch(console.error);
```

В `package.json`:
```json
"scripts": {
  "generate-icons": "node build-icons.js",
  "build": "node build-icons.js && vite build"
}
```

##### Уровень 3. Конфигурация `vite.config.ts` с масками и относительными путями
В `manifest` регистрируются иконки для обоих типов назначения: стандартная (`any`) и адаптивная (`maskable` для круглых иконок Android):
```typescript
manifest: {
  // ...
  icons: [
    {
      src: 'icon_192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: 'icon_256.png',
      sizes: '256x256',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: 'icon_512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: 'icon_512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
}
```

---

## 3. GitHub Actions CI/CD (`.github/workflows/deploy.yml`)

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
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm install

      - name: Build PWA
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
