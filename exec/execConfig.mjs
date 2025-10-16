import path from "path";


const SRC_DIR = './src'; /* 相对于当前项目目录 */
const POSTS_DIR = path.join(SRC_DIR, './posts');
const PUBLIC_DIR = path.join(SRC_DIR, './public');


export {
    SRC_DIR,
    POSTS_DIR,
    PUBLIC_DIR,
}
