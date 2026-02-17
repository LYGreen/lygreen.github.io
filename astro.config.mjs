// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import vue from '@astrojs/vue';
import sitemap from "@astrojs/sitemap";

const domain = 'https://lygreen.top';

// https://astro.build/config
export default defineConfig({
  site: `${domain}`,
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
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