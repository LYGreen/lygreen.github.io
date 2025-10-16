import path from "path";
import { getDirPosts } from "../.script/util.mts";

const SRC_DIR = "./src";

export default {
    async paths() {
        const posts = (await getDirPosts(path.join(SRC_DIR, './posts')));
        const set = new Set<string>();

        posts.forEach((p) => {
            const tags = p.tag;
            tags?.forEach(c => {
                set.add(c);
            });
        });

        return [
            {
                params: {
                    index: 'index',
                    tags: [...set],
                }
            }
        ]
    }
}