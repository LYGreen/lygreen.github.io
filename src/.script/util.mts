import fs from 'fs/promises'
import path from 'path';
import matter from 'gray-matter';
import Post from "./post.mts";

const SRC_DIR = "./src";

export async function getDirPosts(directory: string) {
    const files = (await fs.readdir(directory)).filter(file => {
        return file.endsWith(".md") && !file.endsWith("-demo.md");
    });
    const posts = await Promise.all(files.map(async f => {
        const fullpath = path.join(directory, f);
        const stats = await fs.stat(fullpath);
        const data = await fs.readFile(fullpath, 'utf8');
        const markdown = matter(data);
        const fullpathWithoutExt = path.parse(fullpath);
        const post: Post = {
            title: markdown.data.title,
            description: markdown.data.description,
            url: path.relative(SRC_DIR, path.join(fullpathWithoutExt.dir, fullpathWithoutExt.name)).replace('\\', '/'),
            createdTime: stats.birthtime.toISOString(),
            updatedTime: stats.mtime.toISOString(),
            readingTime: markdown.data.readingTime,
            category: markdown.data.category,
            tag: markdown.data.tag,
        };
        return post;
    }));
    return posts;
}

export function sortPostsByCreatedTime(posts: Post[]) {
    posts.sort((a, b) => {
        // ISO 8601 格式 时间的字符串可以直接比较
        if (a.createdTime == b.createdTime) {
            return 0;
        }
        return a.createdTime > b.createdTime ? -1 : 1;
    });
}

