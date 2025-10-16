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
            const tags = p.tag;
            tags?.forEach(c => {
                set.add(c);
            });
        });
        
        set.forEach(s => {
            const ps = posts.filter((p) => {
                return p.tag?.includes(s);
            });

            const d = {
                params: {
                    tag: s,
                    posts: ps
                }
            };

            data.push(d);
        });

        return data;
    }
}
