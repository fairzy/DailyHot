# DailyHot Project Context

## Project Overview
**DailyHot (今日热榜)** is a web application that aggregates trending topics from various popular platforms (like Weibo, Zhihu, Bilibili, etc.) into a single interface.
*   **Author:** imsyy
*   **Version:** 1.0.0

## Tech Stack
*   **Framework:** Vue 3
*   **Build Tool:** Vite
*   **UI Library:** Naive UI (with auto-import)
*   **State Management:** Pinia (with persistence plugin)
*   **Routing:** Vue Router
*   **HTTP Client:** Axios
*   **CSS Preprocessor:** Sass
*   **PWA:** Supported via `vite-plugin-pwa`

## Setup & Running

This project uses `pnpm` as the package manager.

### Installation
```bash
pnpm install
```

### Development Server
Starts the local development server at `http://localhost:6699` (default port).
```bash
pnpm dev
```

### Build for Production
Builds the project for production, minifying code and assets.
```bash
pnpm build
```

### Preview Build
Locally preview the production build.
```bash
pnpm preview
```

## Project Structure

### Key Directories
*   `src/api`: API definition files. `index.js` contains the main data fetching logic (`getHotLists`), and `request.js` likely handles the Axios instance configuration.
*   `src/components`: Reusable Vue components (e.g., `Header`, `Footer`, `HotList`).
*   `src/views`: Page-level components (`Home`, `List`, `Setting`, etc.).
*   `src/store`: State management using Pinia.
*   `src/router`: Routing configuration.
*   `src/style`: Global styles (`global.scss`).

### Configuration Files
*   `.env`: Environment variables.
    *   `VITE_GLOBAL_API`: The backend API URL (Default: `https://api-hot.efefee.cn`).
    *   `VITE_ICP`: ICP filing number.
*   `vite.config.js`: Vite configuration.
    *   Configures `unplugin-auto-import` and `unplugin-vue-components` for Naive UI.
    *   Sets up the PWA plugin.
    *   Defines the `@` alias for `src`.
    *   Sets the dev server port to `6699`.

## Development Conventions
*   **Components:** This project uses the Vue 3 Composition API (`<script setup>`).
*   **UI Components:** Naive UI components are auto-imported. You generally do not need to manually import them.
*   **API Calls:** API calls are centralized in `src/api`.
*   **Styling:** SCSS is used for styling.
