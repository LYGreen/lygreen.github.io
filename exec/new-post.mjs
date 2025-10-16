import fs from 'fs'
import path from 'path';

import { POSTS_DIR } from './execConfig.mjs';

const name = process.argv[2];

if (name == undefined) {
    console.log("Please input a name");
    process.exit(-1);
}

const today = new Date(Date.now()).toLocaleString('zh-cn');

const markdown = `\
---
title: ''
description: ''
createdTime: \'${ today }\'
updatedTime: \'${ today }\'
readingTime: 0
category:
    - ''
tag:
    - ''
hash: ''
---\
`;

fs.writeFileSync(path.join(POSTS_DIR, name + '.md'), markdown);
