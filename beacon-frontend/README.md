# Beacon — React onboarding

Six-screen login and profile flow for the government career guidance portal.

## Quick start (demo — no database)

```bash
cd pathfinder-frontend
npm install
npm run dev
```

Open http://localhost:5173 — `DEMO_MODE` is **on** by default (see `src/config.js`). The UI does **not** call the backend until you turn demo off.

## Connect frontend to backend

See **[CONNECT_BACKEND.md](./CONNECT_BACKEND.md)** for the full step-by-step guide.

Short version:

1. Set up PostgreSQL + Redis and run the API (`pathfinder-backend-copy`).
2. In `src/config.js` set `DEMO_MODE = false`.
3. Restart `npm run dev`.

## Deploy

```bash
VITE_API_URL=https://your-api.example.gov.in npm run build
```

Upload the `dist/` folder to your web host.
