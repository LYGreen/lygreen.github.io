import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: any; }) {
    const blog = await getCollection("blog");
    const sortedPosts = blog.sort((a, b) => new Date(b.data.date as Date).getTime() - new Date(a.data.date as Date).getTime());
    const slicedPosts = sortedPosts.slice(0, 10);
    return rss({
        title: 'LYGreen\'s blog',
        description: 'My personal blog, sharing coding adventures, tech notes, and creative ideas.',
        site: context.site,
        items: slicedPosts.map((post) => {
            return {
                title: post.data.title,
                description: post.data.description,
                author: post.data.author,
                pubDate: post.data.date,
                content: post.rendered?.html,
                link: `/posts/${post.id}`,
            };
        }),
    });
}
