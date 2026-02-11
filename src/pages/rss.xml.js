import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
    const blog = await getCollection("blog");
    const sortedPosts = blog.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
    return rss({
        title: 'LYGreen\'s blog',
        description: 'My personal blog, sharing coding adventures, tech notes, and creative ideas.',
        site: context.site,
        items: sortedPosts.map((post) => {
            return {
                title: post.data.title,
                description: post.data.description,
                author: post.data.author,
                pubDate: post.data.date,
                content: post.rendered.html,
                link: `/posts/${post.id}`,
            };
        }),
    });
}
