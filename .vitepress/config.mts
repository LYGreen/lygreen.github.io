import path from 'path'
import { defineConfig, defineConfigWithTheme } from 'vitepress'
import ThemeConfig from './theme/themeConfig'

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  srcDir: "./src",
  outDir: "./out",
  title: "💝 LYGreen 的博客 💖",
  // titleTemplate: '',
  description: "个人博客",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://lygreen.github.io/",
    lastmodDateOnly: true,
    xmlns: {
      news: false,
      video: false,
      xhtml: false,
      image: false,
    },
    transformItems: (items) => {
      items = items.filter((item) => {
        return item.url.startsWith("posts/") || item.url == '';
      })
      return items;
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    }
  },
  transformPageData(pageData, ctx) {
    pageData.frontmatter.head ??= [];
    if (pageData.relativePath == 'index.md' || pageData.relativePath.startsWith("posts/")) {
      pageData.frontmatter.head.push([
        'meta',
        {
          name: 'robots',
          content: 'index, nofollow',
        },
        ''
      ]);
    } else {
      pageData.frontmatter.head.push([
        'meta',
        {
          name: 'robots',
          content: 'noindex, nofollow',
        },
        ''
      ]);
    }
  },
  head: [
    [
      'script',
      {},
      `
      (function() {
        const localTheme = localStorage.getItem('data-theme');
        if (localTheme != null) {
            document.documentElement.setAttribute('data-theme', localTheme);
        } else {
          const media = window.matchMedia('(prefers-color-scheme: dark)');
          if (media.matches) {
              document.documentElement.setAttribute('data-theme', 'dark');
          } else {
              document.documentElement.setAttribute('data-theme', 'light');
          }
        }
      })();
      `
    ],
  ],
  vite: {
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@use '@/style.scss' as *;`
    //     }
    //   }
    // },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './theme'),
      }
    }
  },
  themeConfig: {
    data: "Hello World",
  }
})
