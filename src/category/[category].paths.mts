import path from "path";
import matter from "gray-matter"

import { getDirPosts } from "../.script/util.mts"
import Post from "../.script/post.mts";

const SRC_DIR = "./src";

export default {
    async paths() {
        const data: Array<any> = [];

        const posts = (await getDirPosts(path.join(SRC_DIR, './posts')));
        const set = new Set<string>();

        posts.forEach((p) => {
            const categories = p.category;
            categories?.forEach(c => {
                set.add(c);
            });
        });
        
        set.forEach(s => {
            const ps = posts.filter((p) => {
                return p.category?.includes(s);
            });

            const d = {
                params: {
                    category: s,
                    posts: ps
                }
            };

            data.push(d);
        });

        return data;
    }
}
