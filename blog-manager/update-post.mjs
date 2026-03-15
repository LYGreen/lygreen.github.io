import fs from 'fs/promises'
import { BLOG_DIR } from "./config.mjs";
import { sperateFrontmatter, render } from './util.mjs';

async function checkIsDirectory(path) {
    try {
        const stats = await fs.stat(path);
        return stats.isDirectory();
    } catch (error) {
        return false; 
    }
}

async function processFile(filename) {
    try {
        if (!filename.endsWith('.md')) {
            throw new Error('Not a markdown file.');
        }

        const raw = await fs.readFile(filename, 'utf-8');
        const { frontmatter, content } = sperateFrontmatter(raw.toString());
        const renderedFrontmatter = render(frontmatter);
        if (renderedFrontmatter !== frontmatter) {
            await fs.writeFile(filename, renderedFrontmatter + content);
        }
    } catch(e) {
        console.error(e);
        return;
    }
}

(async () => {
    const promises = [];
    const stack = [];
    stack.push(BLOG_DIR);
    while (stack.length > 0) {
        const dir = stack.pop();

        const items = await fs.readdir(dir);

        for (const item of items) {
            const path = `${dir}/${item}`;
            const isDirectory = await checkIsDirectory(path);

            if (isDirectory) {
                stack.push(path);
            } else {
                promises.push(processFile(path));
            }
        }
    }

    await Promise.all(promises);
})();
