// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://lygreen.github.io',
  integrations: [
    vue(), 
    sitemap({
      filter: (page) => {
        console.log(page);
        return page.startsWith(`https://lygreen.github.io/posts/`) || page === 'https://lygreen.github.io/';
      },
    }),
  ],
  redirects: {

  },
});