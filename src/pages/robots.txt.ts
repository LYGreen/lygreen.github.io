import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /$
Allow: /posts/
Allow: /sitemap*.xml
Disallow: /
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};
