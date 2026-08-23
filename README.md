# 🎨 Колорист (Colorist PWA) — Умный подбор цветов и гармоний

Автономное PWA-приложение полного цикла для подбора идеальных цветовых гармоний в одежде, интерьере и графическом дизайне по 12-частному кругу Иоганнеса Иттена и правилу пропорций 60-30-10 с поддержкой ИИ-стилиста (Google Gemini).

![PWA Ready](https://img.shields.io/badge/PWA-Offline--First-indigo?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square)
![React](https://img.shields.io/badge/React-19-cyan?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square)
![Express](https://img.shields.io/badge/Express-Backend-green?style=flat-square)

---

## 🌟 Ключевые возможности

1. **Точный захват цвета (Камера & Галерея)**:
   - Встроенный интеллектуальный колориметрический видоискатель с увеличением x2.5 (Magnifier).
   - Сглаживание шума матрицы и усреднение пикселей в зоне фокуса.
   - Определение точного оттенка, HEX, RGB, HSL, цветовой температуры и близости к секторам Иттена.
   - Возможность свободной кастомизации названий предметов.

2. **Интерактивный круг Иттена с геометрическими фигурами**:
   - ⚡ **Комплементарный контраст** (Прямая линия, 180°).
   - 🔺 **Классическая триада** (Равносторонний треугольник, 120°).
   - 📐 **Сплит-комплементарная гармония** (Равнобедренный треугольник).
   - ▢ **Квадрат и прямоугольник** (Четырехцветные тетрады).
   - 🌈 **Аналоговая гамма** (Родственные секторы 30°–60°).
   - 📏 **Монохром** (Радиальный луч со шкалой насыщенности).

3. **3 Режима конструктора капсул**:
   - 👔 **Одежда & Гардероб**: Интерактивный виртуальный манекен (верх, низ, обувь, аксессуары).
   - 🛋️ **Интерьер & Пространство**: Стены, крупная мебель, текстиль и акцентный декор.
   - 🎨 **Свободный подбор**: Свободные цветовые триады и квартеты с пользовательскими именами.

4. **Правило пропорций 60-30-10 & Индекс гармонии**:
   - Автоматический расчет баланса площадей и контрастности.
   - Наглядная шкала гармоничности образа (0–100%) с разбором ошибок.

5. **ИИ-стилист (Gemini Pro/Flash)**:
   - Анализ психологического восприятия, уместности по дресс-коду и сезонности.
   - Подсказки по фактурам тканей, материалам и освещению.

6. **Offline-First PWA**:
   - Работает без интернета через Service Worker (локальный математический движок Иттена не требует сети).
   - Поддержка установки на рабочий стол Android / iOS / Windows / macOS.

---

## 🚀 Быстрый старт и локальный запуск

### 1. Клонирование репозитория
```bash
# GitHub
git clone https://github.com/your-username/colorist-app.git

# Или GitVerse
git clone https://gitverse.ru/your-username/colorist-app.git

cd colorist-app
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```
Укажите ваш API-ключ Gemini (необязательно, при отсутствии ключа работает локальный математический экспертный движок):
```env
GEMINI_API_KEY=ваш_ключ_gemini_api
```

### 4. Запуск в режиме разработки
```bash
npm run dev
```
Приложение откроется по адресу: `http://localhost:3000`

### 5. Сборка для Production
```bash
npm run build
npm start
```

---

## 🛠️ Стек технологий

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion, Lucide Icons, Canvas Confetti.
- **Backend / API**: Express, Node.js (автономный сборщик esbuild в CommonJS `dist/server.cjs`).
- **PWA & Оффлайн**: Web App Manifest, Service Worker (`sw.js`), Canvas Color Averaging.
- **AI**: Google Gen AI SDK (`@google/genai`).

---

## 📦 Синхронизация с GitHub и GitVerse

### Синхронизация через Google AI Studio:
1. В верхнем правом углу Google AI Studio нажмите меню **«Settings» (⚙️)** / **«Export»**.
2. Выберите **«Sync with GitHub»** или **«Export to GitHub»**.
3. Авторизуйте ваш GitHub-аккаунт и выберите репозиторий для автоматического пуша.

### Зеркалирование на GitVerse:
```bash
# Добавить удаленный репозиторий GitVerse
git remote add gitverse https://gitverse.ru/your-username/colorist-app.git

# Отправить ветку main в GitVerse
git push -u gitverse main
```

---

## 📄 Лицензия
MIT License. Свободно для использования и доработки.
