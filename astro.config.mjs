// @ts-check
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import vue from '@astrojs/vue';
import sitemap from "@astrojs/sitemap";

const domain = 'https://lygreen.top';

function admonitionPlugin() {
  return (/** @type {any} */ tree) => {
    visit(tree, (node) => {
      // 这里的 'containerDirective' 对应 ::: 语法
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {});
        const tagName = node.type === 'textDirective' ? 'span' : 'div';
        
        // 设置 HTML 标签名
        data.hName = tagName;
        // 设置 HTML 属性，比如 <div class="admonition info">
        data.hProperties = {
          class: `admonition ${node.name}`,
        };
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: `${domain}`,
  markdown: {
    remarkPlugins: [remarkMath, remarkDirective, admonitionPlugin],
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