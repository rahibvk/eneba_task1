# Eneba Game Offers — Monorepo

Monorepo containing the **API** (Express + SQLite) and **Web** (Vite + React + Tailwind) applications.

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

## Getting Started (Development)

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm --prefix api install
npm --prefix web install

# Seed the database (creates api/data/eneba.db automatically)
npm --prefix api run seed

# Start both API + Web concurrently
npm run dev
```

## Running in Production Locally

Test the production build (minified frontend served directly by the Express API):

```bash
# Build the frontend (outputs to web/dist)
npm run build

# Start the API server in production mode
npm run start
```

Now, navigate to `http://localhost:4000` to view the fully built application. 

## Scripts

| Command            | Description                         |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Run API + Web concurrently          |
| `npm run build`    | Build the Vite frontend application |
| `npm run start`    | Run API in prod (serves frontend explicitly via `:4000`) |
| `npm run test`     | Run API + Web tests (Vitest)        |
| `npm run lint`     | Run ESLint on API + Web             |

### API-specific Scripts

| Command                       | Description                |
| ----------------------------- | -------------------------- |
| `npm --prefix api run seed`   | Seed SQLite with 25 offers |

## API Endpoints

The API is strictly namespaced under `/api` to prevent collisions. Example commands (via port `4000`):

```bash
# Health check
curl http://localhost:4000/api/health
# → { "ok": true, "db": "up" }

# List offers (newest first, default limit=24)
curl http://localhost:4000/api/list

# Paginated list
curl "http://localhost:4000/api/list?limit=10&offset=5"

# Fuzzy search (handles typos natively via SQLite custom trigram)
curl "http://localhost:4000/api/list?search=split+fictuon"
# → matches "Split Fiction" and "Splinter Cell"
```

## UI States

- **Empty state:** Displays "No results found" natively when the backend returns 0 items.
- **Error state:** Displays a friendly error message and a "Retry" button if the API request fails.
- **Loading state:** Displays a grid of CSS skeleton placeholders.

## Project Structure

```
eneba_game/
├── api/                     # Express API + SQLite
│   ├── src/
│   │   ├── index.js         # Server entry point (dotenv + listen)
│   │   ├── app.js           # Express app (routes, middleware, cors, production static serve)
│   │   ├── db.js            # SQLite setup + custom similarity()
│   │   ├── validate.js      # Query param parsing/clamping
│   │   ├── seed.js          # Seed 25 game offers
│   │   ├── routes/
│   │   │   ├── health.js    # GET /api/health
│   │   │   └── list.js      # GET /api/list (fuzzy search)
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── data/
│   │   └── eneba.db         # SQLite database (auto-created)
│   └── tests/
│       ├── health.test.js
│       └── validate.test.js
├── web/                     # Vite + React + Tailwind
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.test.jsx
│   │   ├── api.js           # Handles safe relative paths (/api/list)
│   │   └── ...
│   └── .env.example
├── package.json             # Root orchestration scripts
└── README.md
```
