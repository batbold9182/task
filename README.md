# The Library

A book discovery app powered by the [Open Library API](https://openlibrary.org). Search millions of books by title, filter by author, and save your favorites locally.

## Features

- **Book Search** — Search by title using Open Library's search endpoint
- **Author Filter** — Narrow results by author name
- **Favorites** — Save books to a personal list (stored in localStorage)
- **Cover Art** — Displays book covers from Open Library Covers API

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **Vite** — Build tool & dev server
- **Vanilla JS** — No framework dependencies
- **Open Library API** — Book data & cover images

## Project Structure

```
index.html          — Main HTML page
src/
  main.js           — UI logic & event handling
  api.js            — Open Library API integration
  favorites.js      — Favorites management (localStorage)
  style.css         — Styles
vite.config.js      — Vite configuration
```
### LightHouse audit
<img width="1919" height="961" alt="image" src="https://github.com/user-attachments/assets/82b1868d-23c4-4161-b73d-ab352ba69ef1" />
