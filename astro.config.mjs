// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Serve from a sub-folder by building with e.g. SITE_BASE=/website; defaults to the domain root.
  base: process.env.SITE_BASE || '/',
});
