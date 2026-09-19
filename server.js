import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, 'dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');

// If dist/index.html does not exist, trigger a production build automatically
if (!fs.existsSync(INDEX_FILE)) {
  console.log('⚠️ dist/index.html not found. Running "npm run build" to generate production assets...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Build completed successfully.');
  } catch (err) {
    console.error('❌ Automatic build failed:', err);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  // Only handle GET and HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  // Health check endpoint
  if (req.url === '/health' || req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  let pathname = '/';
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  // Path traversal protection
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePath);

  // If pointing to a directory, check for index.html within it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  let targetFile = filePath;
  let isSpaFallback = false;

  if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
    // Exact file matched
  } else {
    // SPA Fallback: route everything else to dist/index.html
    targetFile = INDEX_FILE;
    isSpaFallback = true;
  }

  if (!fs.existsSync(targetFile)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found - Frontend build not found.');
    return;
  }

  const ext = path.extname(targetFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
  };

  // Caching strategy: immutable long cache for hashed assets, revalidate index.html
  if (!isSpaFallback && targetFile.includes(path.join('dist', 'assets'))) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else if (ext === '.html' || isSpaFallback) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  }

  try {
    const stat = fs.statSync(targetFile);
    headers['Content-Length'] = stat.size;
    res.writeHead(200, headers);

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(targetFile);
    stream.pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Lokah Builders frontend production server listening on http://${HOST}:${PORT}`);
  console.log(`📁 Serving static assets from: ${DIST_DIR}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing HTTP server...');
  server.close(() => process.exit(0));
});
