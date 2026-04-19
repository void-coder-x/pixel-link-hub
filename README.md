# Pixel Link Hub

A personal dashboard to organize and access your favourite links — built with React + Vite + Tailwind CSS.

---

## Features

- **Add / Edit / Delete** links with title, URL, and category
- **Real-time search** filters by title, URL or category
- **Auto-fetched favicons** via Google's S2 API
- **Grouped by category** with stable colour coding
- **Dark / Light theme** toggle (preference persisted)
- **LocalStorage persistence** — data survives refreshes
- **Responsive grid** — works on mobile, tablet, desktop
- **Pixel aesthetic** — custom cursor, Press Start 2P font, neon glow accents

---

## Setup

### Prerequisites
- Node.js v18 or later
- npm v9 or later

### Install & Run

```bash
# 1. Enter the project folder
cd pixel-link-hub

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview the built app locally
```

---

## Project Structure

```
pixel-link-hub/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component, state management
    ├── components/
    │   ├── TopBar.jsx        # Search bar + theme toggle
    │   ├── CategorySection.jsx  # Category heading + link grid
    │   ├── LinkCard.jsx      # Individual link card
    │   ├── AddLinkModal.jsx  # Add/edit modal with validation
    │   └── DeleteConfirmModal.jsx
    ├── hooks/
    │   └── useLinks.js       # CRUD + localStorage sync
    ├── utils/
    │   └── storage.js        # LocalStorage helpers, defaults, utils
    └── styles/
        └── index.css         # Global styles, CSS variables, animations
```

---

## Customisation

- **Default links** — edit the `DEFAULT_LINKS` array in `src/utils/storage.js`
- **Category order** — edit `CATEGORY_ORDER` in `src/App.jsx`
- **Theme colours** — edit CSS variables in `src/styles/index.css`
