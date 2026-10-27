// Prefixes site-root paths with the base path, so the site works at a domain root ("/")
// or in a sub-folder (set SITE_BASE=/website when building). Leaves other links alone.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const u = (path: string) => (path.startsWith('/') ? base + path : path);
