/**
 * Centralized API base URL for all frontend requests.
 *
 * Configured strictly via environment variables:
 * - VITE_API_URL (Vite) or REACT_APP_API_URL
 *
 * Rejects any GoDaddy Airo preview URLs (*.preview.*.airoapp.ai)
 * to prevent accidental auth/preflight failure loops.
 */

const rawInjected = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  ''
).trim().replace(/\/+$/, '');

const isAiroPreviewUrl =
  rawInjected.includes('.preview.') && rawInjected.includes('.airoapp.ai');

let resolvedUrl = rawInjected;

if (!resolvedUrl) {
  console.warn(
    '[Lokah API] VITE_API_URL is not set in the environment. Set VITE_API_URL in your .env or build settings.'
  );
} else if (isAiroPreviewUrl) {
  console.warn(
    `[Lokah API] Rejected invalid preview API URL: "${rawInjected}". Preview domains require platform auth and cannot serve API requests. Please set VITE_API_URL to your published backend URL.`
  );
  resolvedUrl = '';
}

// Normalize: ensure trailing /api path without double slashes
export const API_URL: string = resolvedUrl
  ? (resolvedUrl.endsWith('/api') ? resolvedUrl : `${resolvedUrl}/api`)
  : '/api';
