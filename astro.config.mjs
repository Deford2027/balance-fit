import { defineConfig } from 'astro/config';

/* GitHub Pages отдаёт сайт из подпапки /balance-fit/ – её задаёт PUBLIC_BASE
   при сборке в CI; локально сайт живёт в корне. */
export default defineConfig({
  site: 'https://deford2027.github.io',
  base: process.env.PUBLIC_BASE || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
});
