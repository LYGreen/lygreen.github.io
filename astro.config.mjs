// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import sitemap from "@astrojs/sitemap";

const domain = 'https://lygreen.top';

// https://astro.build/config
export default defineConfig({
  site: `${domain}`,
  integrations: [
    vue(), 
    sitemap({
      filter: (page) => {
        return page.startsWith(`${domain}/posts/`) || page === `${domain}`;
      },
    }),
  ],
  redirects: {

  },
});