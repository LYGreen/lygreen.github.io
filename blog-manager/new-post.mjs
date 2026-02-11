import fs from 'fs/promises'
import { BLOG_MANAGER_DIR, BLOG_DIR } from './config.mjs';
import { sperateFrontmatter, render } from './util.mjs';

const name = process.argv[2] || '';
if (name === '') {
    console.error('请输入文章名称');
    process.exit(1);
}


/**
 * 判断文件是否存在
 * @param {string} path - 文件路径
 * @returns {Promise<boolean>}
 */
async function checkFile(path) {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        return false;
    }
}

(async () => {
    if (await checkFile(`${BLOG_DIR}/${name}.md`)) {
        console.error('文件已存在');
        process.exit(1);
    }

    const template = await fs.readFile(`${BLOG_MANAGER_DIR}/template.md`, 'utf-8');

    const { frontmatter, content } = sperateFrontmatter(template);

    const renderedFrontmatter = await render(frontmatter, name);

    await fs.writeFile(`${BLOG_DIR}/${name}.md`, renderedFrontmatter + content);

})();
