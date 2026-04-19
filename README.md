# Songs Dashboard — Frontend

A Next.js frontend for browsing, sorting, searching, and rating a songs playlist dataset.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** — utility-first styling
- **Recharts** — scatter, histogram, and bar charts
- **Jest + React Testing Library** — unit tests

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- The backend API running (see backend README)

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. (Optional) Point to a different backend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

```bash
pnpm test                # run all tests
pnpm test:coverage       # run with coverage report
```

## Features

| Feature | Details |
| --- | --- |
| **Table** | All song attributes, paginated (10 rows/page) |
| **Sorting** | Click any column header to sort asc/desc |
| **Search** | Enter a title → "Get Song" button → highlights the result |
| **Star rating** | Click stars in the Rating column to rate 1–5 (saved via API) |
| **Export CSV** | Downloads the current page as a `.csv` file |
| **Danceability chart** | Scatter plot — song index vs. danceability |
| **Duration histogram** | Bar chart — songs bucketed by duration in seconds |
| **Acousticness & Tempo** | Two bar charts, first 30 songs each |

## Project Structure

```text
src/
├── app/               # Next.js App Router (layout, page)
├── components/
│   ├── SongsTable.tsx # Paginated, sortable table with star ratings
│   ├── StarRating.tsx # Reusable 1–5 star widget
│   ├── SearchBar.tsx  # Title search form
│   └── charts/        # Recharts-based visualisations
├── lib/
│   ├── api.ts         # fetch wrappers for the backend REST API
│   └── csv.ts         # songsToCSV / downloadCSV utilities
└── types/
    └── song.ts        # Song & PaginatedSongsResponse interfaces
```

## API Endpoints (backend)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/songs` | All songs (paginated). Params: `page`, `page_size`, `search_query`, `sort_by`, `order` |
| PATCH | `/songs/{index}/rating` | Update star rating. Body: `{ "rating": 1–5 }` |
