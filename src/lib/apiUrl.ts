/**
 * Centralized API base URL for all frontend requests.
 *
 * Primary: VITE_API_URL (or REACT_APP_API_URL) if set and not a preview host.
 * Fallback: https://6qxwqtx3i8.c40.airoapp.ai/api with a console warning if missing or preview.
 * Never returns an empty or relative base URL.
 */

const FALLBACK_API_URL = 'https://6qxwqtx3i8.c40.airoapp.ai/api';

const rawInjected = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  ''
).trim().replace(/\/+$/, '');

const allowPreview = import.meta.env.VITE_ALLOW_PREVIEW_API === 'true';
const isAiroPreviewUrl =
  !allowPreview && rawInjected.includes('.preview.') && rawInjected.includes('.airoapp.ai');

let resolvedUrl = rawInjected;

if (!resolvedUrl) {
  if (import.meta.env.DEV) {
    console.info(`[Lokah API] VITE_API_URL not set. Using production backend: ${FALLBACK_API_URL}`);
  }
  resolvedUrl = FALLBACK_API_URL;
} else if (isAiroPreviewUrl) {
  // GoDaddy Airo preview environments inject the frontend's preview URL into VITE_API_URL.
  // Since the backend lives on production (6qxwqtx3i8.c40.airoapp.ai), route to it unless overridden.
  if (import.meta.env.DEV) {
    console.info(`[Lokah API] Redirecting preview URL to live backend: ${FALLBACK_API_URL}`);
  }
  resolvedUrl = FALLBACK_API_URL;
}

// Normalize: ensure trailing /api path without double slashes and never relative
const normalized = resolvedUrl.endsWith('/api') ? resolvedUrl : `${resolvedUrl}/api`;

export const API_URL: string = normalized.startsWith('http') ? normalized : FALLBACK_API_URL;
