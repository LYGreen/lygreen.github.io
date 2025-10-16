import fs from 'fs/promises'

interface PostsPageInfo {
    postsPerPage: number,
    totalPages: number,
    length: number,
}

export default {
    async paths() {
        const json = await fs.readFile("src/public/json/posts-page-info.json", "utf-8");
        const obj = JSON.parse(json) as PostsPageInfo;
        const data : Array<any> = [];

        /* 第一页放在首页当中 */
        for (let i = 1; i < obj.totalPages; i++) {
            data.push({
                params: {
                    page: i + 1,
                }
            });
        }

        return data;
    }
}
