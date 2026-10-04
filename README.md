# Lokah Builders — Frontend Client

The official web portal and client interface for **Lokah Builders & Developers Pvt Ltd**, built with React 18, TypeScript, Tailwind CSS, Vite, and Framer Motion.

---

## Production Deployment

### Option A: Static Web Hosting (Recommended)
The production bundle is already compiled and optimized inside the `dist/` directory.

1. Configure your web server (Nginx, Apache, Netlify, Vercel, or cPanel Web Root).
2. Point the document root to `dist/`.
3. Ensure SPA client-side routing is enabled (see `nginx.conf` included in this directory).
4. Configure the API endpoint in `.env.production`:
   ```env
   VITE_API_URL=https://your-api-domain.com/api
   ```

### Option B: Node.js Static Server
A production-ready HTTP server with gzip compression and cache headers is included:
```bash
npm install --production
npm run start
```
By default, this serves the `dist/` directory on port `3000` (configurable via `PORT` environment variable).

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Compile fresh production build
npm run build
```

---

## Included Deployment Assets
- `dist/` — Optimized production static build.
- `nginx.conf` — Ready-to-use Nginx SPA configuration.
- `Dockerfile` & `docker-compose.yml` — Containerized deployment specs.
- `server.js` — Lightweight Node.js server with native gzip compression.
