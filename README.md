# 📋 Daily Standup Generator

A lightweight React app that generates formatted daily standup messages — ready to paste into Slack, Teams, or any chat tool.

![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)

## ✨ Features

- **Work location** — toggle between 🏠 Home and 🏢 Office
- **Live weather** — type any city, auto-fetches temperature & weather emoji via [Open-Meteo](https://open-meteo.com/) (falls back to Netherlands if not found)
- **Support handler** — name of today's support person
- **Sprint goal** — message of the day
- **Dynamic targets** — add/remove numbered targets (1️⃣–9️⃣)
- **One-click generate** — formats output ready for Slack/Teams
- **Copy to clipboard** — with ✅ confirmation
- **Keyboard shortcut** — `Ctrl+Enter` / `⌘+Enter` to generate
- **Persists settings** — location, city, and handler are saved in `localStorage`
- **Dark mode** — follows your system preference
- **Accessible** — proper ARIA labels, live regions, keyboard navigable

### Example output

```
🏠 | ⛅ 14°C | ⛑️ Jos | 🎯 Fix login bug
1️⃣ Write unit tests
2️⃣ Review PR #42
3️⃣ Update documentation
```

## 🚀 Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🧪 Scripts

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start Vite dev server with HMR                 |
| `npm run build`         | Production build to `dist/`                    |
| `npm run preview`       | Preview production build locally               |
| `npm run lint`          | ESLint check                                   |
| `npm run lint:fix`      | ESLint auto-fix                                |
| `npm run format`        | Prettier format all files                      |
| `npm run format:check`  | Prettier check (CI-friendly)                   |
| `npm run test`          | Run tests with Vitest                          |
| `npm run test:watch`    | Run tests in watch mode                        |
| `npm run test:coverage` | Run tests with coverage report                 |
| `npm run ci`            | Full CI pipeline: lint → format → test → build |

## 📁 Project structure

```
src/
  App.jsx                        ← main app orchestrator
  App.css                        ← all component styles
  index.css                      ← global styles + dark mode
  main.jsx                       ← React entry point
  components/
    ErrorBoundary.jsx            ← catches render errors
    Hero.jsx                     ← intro header
    LocationPicker.jsx           ← Home / Office radio pills
    WeatherInput.jsx             ← city text input + weather badge
    TargetList.jsx               ← dynamic target rows
    OutputSection.jsx            ← readonly textarea + copy button
  hooks/
    useLocalStorage.js           ← persistent state hook
    useWeather.js                ← debounced geocoding + weather fetch
  utils/
    constants.js                 ← shared constants
    weather.js                   ← API helpers + weather code mapping
  test/                          ← all test files
.github/workflows/ci.yml        ← GitHub Actions CI pipeline
```

## 🔧 Tech stack

- **React 19** with plain `useState` / `useEffect` (no external UI libraries)
- **Vite 8** for dev/build
- **Vitest** + **React Testing Library** for tests
- **ESLint** + **Prettier** for code quality
- **Open-Meteo API** for weather (free, no API key)

## 📄 License

MIT
