import fs from 'fs/promises'
import path from 'path';
import matter from 'gray-matter';

import { SRC_DIR, POSTS_DIR, PUBLIC_DIR } from "./execConfig.mjs";

const JSON_DIR = path.join(PUBLIC_DIR, './json');
const PAGINATION_JSON_DIR = path.join(JSON_DIR, './');
const CATEGORY_JSON_DIR = path.join(JSON_DIR, './category');
const TAG_JSON_DIR = path.join(JSON_DIR, './tag');
const POSTS_PER_PAGE = 3;
const CATEGORIES_PER_PAGE = 30;
const TAGS_PER_PAGE = 30;

/**
 * @typedef {Object} Post
 * @property {string | undefined} title
 * @property {string | undefined} description
 * @property {string | undefined} createdTime
 * @property {string | undefined} updatedTime
 * @property {number | undefined} readingTime
 * @property {string[] | undefined} category
 * @property {string[] | undefined} tag
 * @property {string | undefined} originBasename
 * @property {string | undefined} url
 */

/**
 * @typedef {Object} PostsPageInfo
 * @property {number} postsPerPage
 * @property {number} totalPages
 * @property {number} length
 */

/**
 * @typedef {Object} ElementPageInfo
 * @property {number} elementsPerPage
 * @property {number} totalPages
 * @property {number} length
 */

/**
 * @typedef {Object} CategoriesPageInfo
 * @property {string} currentCategory
 * @property {number} postsPerPage
 * @property {number} totalPages
 * @property {number} length
 */

/**
 * @typedef {Object} TagsPageInfo
 * @property {string} currentTag
 * @property {number} postsPerPage
 * @property {number} totalPages
 * @property {number} length
 */

/**
 * 
 * @param {Post[]} posts 
 */
function sortPostsByCreatedTime(posts) {
    posts.sort((a, b) => {
        const aTime = new Date(a.createdTime);
        const bTime = new Date(b.createdTime);
        if (aTime == bTime) {
            return 0;
        }
        return aTime > bTime ? -1 : 1;
    });
}

/**
 * 
 * @param {string} dir 
 */
async function clearFiles(dir) {
    const files = await fs.readdir(dir);
    if (files.length > 0) {
        await Promise.all(files.map(async (f) => {
            await fs.rm(path.join(dir, f), { force: true, recursive: true });
        }));
    }
}

/**
 * 
 * @param {string} path 
 */
async function createFolder(path) {
    try {
        await fs.access(path);
    } catch(e) {
        await fs.mkdir(path);
    }
}

/**
 * 
 * @param {string[]} dir 
 * @returns {Promise<Post[]>}
 */
async function getPosts(dir) {
    const files = await fs.readdir(dir);

    const posts = await Promise.all(files.map(async (f) => {
        const realPath = path.join(POSTS_DIR, f);
        const buffer = await fs.readFile(realPath);
        const markdown = matter(buffer);
        const htmlBasename = path.join(path.basename(f, path.extname(f)) + '.html');
        const url = path.join(path.relative(SRC_DIR, POSTS_DIR), htmlBasename).replace('\\', '/');
        
        /** @type {Post} */
        const post = {
            title: markdown.data.title,
            description: markdown.data.description,
            createdTime: markdown.data.createdTime,
            updatedTime: markdown.data.updatedTime,
            readingTime: markdown.data.readingTime,
            category: markdown.data.category,
            tag: markdown.data.tag,
            originBasename: f,
            url: url
        }
        return post;
    }));
    return posts;
}

/**
 * 获取页数
 * @param {number} postsPerPage 每页文章数
 * @param {number} postsCount 总文章数
 * @returns {number}
 */
function getPageCount(postsPerPage, postsCount) {
    const quotient = Math.trunc(postsCount / postsPerPage);
    const remainder = postsCount % postsPerPage;
    const total = quotient + (remainder == 0 ? 0 : 1);

    return total;
}

/**
 * @deprecated 已弃用
 */
async function generateHomePagination() {
    await createFolder(PAGINATION_JSON_DIR);

    await clearFiles(PAGINATION_JSON_DIR);

    const posts = await getPosts(POSTS_DIR);
    
    sortPostsByCreatedTime(posts);

    const quotient = Math.trunc(posts.length / POSTS_PER_PAGE);
    const remainder = posts.length % POSTS_PER_PAGE;
    const total = quotient + (remainder == 0 ? 0 : 1);

    /** @type {PostsPageInfo} */
    const postsPageInfo = {
        postsPerPage: POSTS_PER_PAGE,
        totalPages: total,
        length: posts.length,
    }
    
    const promises = [];

    promises.push(fs.writeFile(
        path.join(PAGINATION_JSON_DIR, './posts-page-info.json'),
        JSON.stringify(postsPageInfo, null, 2)
        ));

    for (let i = 0; i < total; i++) {
        const jsonFilename = path.join(PAGINATION_JSON_DIR, './posts-page-' + (i + 1) + '.json');
        const postsPerPage = posts.splice(0, POSTS_PER_PAGE);

        promises.push(fs.writeFile(jsonFilename, JSON.stringify(postsPerPage, null, 2)));
    }
    await Promise.all(promises);
}


async function generate() {
    /* 如果没有 json 文件夹就创建 json 文件夹，并清空 json 文件夹 */
    await createFolder(JSON_DIR);
    await clearFiles(JSON_DIR);

    /* 创建 首页、分类、标签 分页的文件夹 */
    await Promise.all([
        createFolder(PAGINATION_JSON_DIR),
        createFolder(CATEGORY_JSON_DIR),
        createFolder(TAG_JSON_DIR),
    ]);

    const posts = await getPosts(POSTS_DIR);
    sortPostsByCreatedTime(posts);

    /** @type {Set<String>} 分类集合 */
    const categorySet = new Set();
    /** @type {Set<String>} 标签集合 */
    const tagSet = new Set();
    
    for (let i = 0; i < posts.length; i++) {
        const mkCategory = posts[i].category;
        const mkTag = posts[i].tag;
        mkCategory.forEach((val) => {
            categorySet.add(val);
        });
        mkTag.forEach((val) => {
            tagSet.add(val);
        });
    }

    /* 创建具体分类、具体标签的文件夹 */
    await Promise.all(
        [...categorySet].map(async (val) => {
            return await createFolder(path.join(CATEGORY_JSON_DIR, val));
        }),
        [...tagSet].map(async (val) => {
            return await createFolder(path.join(TAG_JSON_DIR, val));
        }),
    );
    
    /* ===== 开始创建文件 ===== */

    /* Promises */
    const promises = [];

    /* ----- 创建每一页 ----- */

    /** @type {Post[]} 首页页面所包含的文章 */
    const paginationPosts = Array.from(posts);
    /** @type {Map<string, Post[]} 具体分类页面所包含的文章 */
    const categoriesPosts = new Map();
    /** @type {Map<string, Post[]} 具体标签页面所包含的文章 */
    const tagsPosts = new Map();

    await Promise.all([
        [...categorySet].map(async (val) => {
            categoriesPosts.set(val, []);
            for (let i = 0; i < posts.length; i++) {
                const mkCategory = posts[i].category;
                if (mkCategory.indexOf(val) != -1) {
                    categoriesPosts.get(val).push(posts[i]);
                }
            }
        }),
        [...tagSet].map(async (val) => {
            tagsPosts.set(val, []);
            for (let i = 0; i < posts.length; i++) {
                const mkTag = posts[i].tag;
                if (mkTag.indexOf(val) != -1) {
                    tagsPosts.get(val).push(posts[i]);
                }
            }
        }),
    ]);

    /* ----- 创建分页信息 ----- */

    /** @type {PostsPageInfo} 首页分页信息 */
    const paginationPageInfo = {
        postsPerPage: POSTS_PER_PAGE,
        totalPages: getPageCount(POSTS_PER_PAGE, paginationPosts.length),
        length: paginationPosts.length,
    }

    /** @type {ElementPageInfo} 分类分页信息 */
    const categoryPageInfo = {
        elementsPerPage: CATEGORIES_PER_PAGE,
        totalPages: getPageCount(CATEGORIES_PER_PAGE, categorySet.size),
        length: categorySet.size,
    }
    /** @type {ElementPageInfo} 标签分页信息 */
    const tagPageInfo = {
        elementsPerPage: TAGS_PER_PAGE,
        totalPages: getPageCount(TAGS_PER_PAGE, tagSet.size),
        length: tagSet.size,
    }

    /** @type {Map<string, CategoriesPageInfo>} 具体分类分页信息 */
    const categoriesPageInfo = new Map();
    /** @type {Map<string, TagsPageInfo>} 具体标签分页信息 */
    const tagsPageInfo = new Map();

    await Promise.all(
        [...categorySet].map(async (val) => {
            const length = categoriesPosts.get(val).length;
            const total = getPageCount(POSTS_PER_PAGE, length);
            /** @type {CategoriesPageInfo} */
            const pageInfo = {
                currentCategory: val,
                postsPerPage: POSTS_PER_PAGE,
                totalPages: total,
                length: length,
            }
            categoriesPageInfo.set(val, pageInfo);
        }),
        [...tagSet].map(async (val) => {
            const length = tagsPosts.get(val).length;
            const total = getPageCount(POSTS_PER_PAGE, length);
            /** @type {TagsPageInfo} */
            const pageInfo = {
                currentTag: val,
                postsPerPage: POSTS_PER_PAGE,
                totalPages: total,
                length: length,
            }
            tagsPageInfo.set(val, pageInfo);
        }),
    );

    /* ----- 开始写入文件 ----- */
    
    /* --- 分页信息加入队列 --- */
    promises.push([
        fs.writeFile(path.join(PAGINATION_JSON_DIR, "./posts-page-info.json"), JSON.stringify(paginationPageInfo, null, 2)),
        fs.writeFile(path.join(CATEGORY_JSON_DIR, "./category-page-info.json"), JSON.stringify(categoryPageInfo, null, 2)),
        fs.writeFile(path.join(TAG_JSON_DIR, "./tag-page-info.json"), JSON.stringify(tagPageInfo, null, 2)),
        [...categoriesPageInfo].map(async ([str, pageInfo]) => {
            return await fs.writeFile(path.join(CATEGORY_JSON_DIR, str, "./posts-page-info.json"), JSON.stringify(pageInfo, null, 2));
        }),
        [...tagsPageInfo].map(async ([str, pageInfo]) => {
            return await fs.writeFile(path.join(TAG_JSON_DIR, str, "./posts-page-info.json"), JSON.stringify(pageInfo, null, 2));
        }),
    ]);

    /* --- 每一页的内容加入队列 --- */
    for (let i = 0; i < paginationPageInfo.totalPages; i++) {
        const jsonFilename = path.join(PAGINATION_JSON_DIR, './posts-page-' + (i + 1) + '.json');
        const postsPerPage = paginationPosts.splice(0, paginationPageInfo.postsPerPage);

        promises.push(fs.writeFile(jsonFilename, JSON.stringify(postsPerPage, null, 2)));
    }

    /* 分类页面每一页的内容 */
    const categoryArray = [...categorySet];
    
    for (let i = 0; i < categoryPageInfo.totalPages; i++) {
        const jsonFilename = path.join(CATEGORY_JSON_DIR, './category-page-' + (i + 1) + '.json');
        const elementsPerPage = categoryArray.splice(0, categoryPageInfo.elementsPerPage);

        promises.push(fs.writeFile(jsonFilename, JSON.stringify(elementsPerPage, null, 2)));
    }

    /* 标签页面每一页的内容 */
    const tagArray = [...tagSet];
    for (let i = 0; i < tagPageInfo.totalPages; i++) {
        const jsonFilename = path.join(TAG_JSON_DIR, './tag-page-' + (i + 1) + '.json');
        const elementsPerPage = tagArray.splice(0, categoryPageInfo.elementsPerPage);

        promises.push(fs.writeFile(jsonFilename, JSON.stringify(elementsPerPage, null, 2)));
    }
    
    await Promise.all([
        [...categorySet].map(async (val) => {
            const pageInfo = categoriesPageInfo.get(val);
            const posts = categoriesPosts.get(val);
            for (let i = 0; i < pageInfo.totalPages; i++) {
                const jsonFilename = path.join(CATEGORY_JSON_DIR, val, './posts-page-' + (i + 1) + '.json');
                const postsPerPage = posts.splice(0, pageInfo.postsPerPage);

                promises.push(fs.writeFile(jsonFilename, JSON.stringify(postsPerPage, null, 2)));
            }
        }),
        [...tagSet].map(async (val) => {
            const pageInfo = tagsPageInfo.get(val);
            const posts = tagsPosts.get(val);
            for (let i = 0; i < pageInfo.totalPages; i++) {
                const jsonFilename = path.join(TAG_JSON_DIR, val, './posts-page-' + (i + 1) + '.json');
                const postsPerPage = posts.splice(0, pageInfo.postsPerPage);

                promises.push(fs.writeFile(jsonFilename, JSON.stringify(postsPerPage, null, 2)));
            }
        }),
    ]);

    /* --- 全部写入 --- */
    await Promise.all(promises);

}

(async () => {
    await generate();
})();
