
# Ecclesia Web (frontend)

This is a minimal React frontend scaffold (Vite + TypeScript) configured to call a backend endpoint GET `/api/v1/hello` and display the returned JSON.

Overview
- Development proxy: `/api/*` is proxied to `http://localhost:8000` by `vite.config.ts` (dev only).

Requirements
- Node.js 18+ and a package manager (npm, pnpm or yarn).

Development

1. Change to the `web` directory:

```bash
cd web
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

The dev server runs on `http://localhost:5173` by default. API requests sent to `/api/*` will be forwarded to `http://localhost:8000/api/*`. Make sure the backend is running on port 8000 or update the proxy target in `vite.config.ts`.

Production build

Build the optimized production bundle:

```bash
cd web
npm run build
```

The production files are emitted to `web/dist`. Serve them with any static file server (NGINX, Caddy, GitHub Pages, etc.). To preview the production build locally:

```bash
npm run preview
```

API and runtime behavior
- The app fetches `/api/v1/hello` from the browser. In development this is proxied to the backend. In production you should use either:
	- a full absolute API URL in your frontend (e.g. `https://api.example.com/api/v1/hello`), or
	- a reverse proxy / load balancer that exposes the same `/api` path.

Where to look
- App entry: `src/main.tsx`
- Main component and example fetch: `src/App.tsx`
- Vite config & dev proxy: `vite.config.ts`

Troubleshooting
- If you see CORS or connection errors, confirm the backend is running and reachable at the address configured in `vite.config.ts`.
- If the app shows no data, open the browser DevTools Network tab to inspect the `/api/v1/hello` request and response.

If you'd like, I can also:
- switch the fetch in `src/App.tsx` to use an environment variable for the API base URL, or
- add a small Dockerfile or NGINX config to serve the `dist` folder in production.

