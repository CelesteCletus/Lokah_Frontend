/**
 * Centralized API base URL for all fetch calls.
 *
 * The correct production backend is: https://68v1kl1ewi.c40.airoapp.ai/api
 *
 * Problem: GoDaddy Airo injects VITE_API_URL at build time using the value
 * configured in its dashboard. That value has incorrectly been set to the
 * frontend's own preview domain (adp691i6fs.preview.c40.airoapp.ai) instead
 * of the separate backend domain (68v1kl1ewi.c40.airoapp.ai). Since Vite
 * bakes this at build time, the wrong URL ends up hardcoded in the bundle.
 *
 * Guard logic:
 *   1. Read VITE_API_URL (may be injected correctly or incorrectly by GoDaddy).
 *   2. Reject it if it points to a *.preview.c40.airoapp.ai domain — that is
 *      always the frontend preview domain, never the backend.
 *   3. Reject it if it contains the frontend app ID "adp691i6fs" — that is
 *      the frontend container ID, not the backend.
 *   4. Fall back to the hardcoded correct backend URL.
 *
 * This ensures the correct backend URL is used regardless of what GoDaddy
 * injects, while still respecting a correctly-configured VITE_API_URL.
 */

const CORRECT_BACKEND = 'https://68v1kl1ewi.c40.airoapp.ai/api';

const injected = import.meta.env.VITE_API_URL || '';

const isPreviewFrontend =
  injected.includes('adp691i6fs') ||          // this app's frontend container ID
  injected.includes('preview.c40.airoapp.ai'); // preview domain is always frontend, not backend

/**
 * The resolved API base URL for all HTTP requests to the backend.
 * Safe to use directly: `fetch(`${API_URL}/auth/login`, ...)`.
 */
export const API_URL: string =
  injected && !isPreviewFrontend ? injected : CORRECT_BACKEND;
