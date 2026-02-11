import fs from 'fs/promises'
import { BLOG_DIR } from "./config.mjs";
import { sperateFrontmatter, render } from './util.mjs';

(async () => {
    const files = await fs.readdir(BLOG_DIR);

    files.forEach(async (file) => {
        const raw = await fs.readFile(`${BLOG_DIR}/${file}`, 'utf-8');

        const { frontmatter, content } = sperateFrontmatter(raw.toString());

        const renderedFrontmatter = render(frontmatter);

        if (renderedFrontmatter !== frontmatter) {
            await fs.writeFile(`${BLOG_DIR}/${file}`, renderedFrontmatter + content);
        }
    });
})();
