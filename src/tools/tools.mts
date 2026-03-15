import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * 获取文章并分页，支持置顶和自定义排序
 */
async function getSortedPosts(includePin?: boolean) {
    const allPosts = await getCollection("blog");

    // 1. 综合排序：先排置顶，置顶内部和非置顶内部按时间倒序
    const sortedPosts = allPosts.sort((a, b) => {
        if (includePin) {
            // 如果 a 是置顶而 b 不是，a 应该排在前面 (-1)
            if (a.data.pin !== b.data.pin) {
                return a.data.pin ? -1 : 1;
            }
        }
        // 否则按时间排序
        return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    });
    
    return sortedPosts;
}

/**
 * 处理分页后的文章数据
 */
function getPagedPosts(posts: CollectionEntry<"blog">[], postsPerPage: number, currentPage: number) {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const splicedPosts = posts.slice((currentPage - 1) * postsPerPage, postsPerPage * currentPage);

    return { splicedPosts, totalPages };
}

export {
    getSortedPosts,
    getPagedPosts,
}
