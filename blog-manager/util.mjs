import fs from 'fs/promises';

/**
 * 
 * @param {Date} date 
 */
function toISOStringOffsetUTC8(date) {
    const pad = (num) => String(num).padStart(2, '0');
    
    const local = new Date(date.getTime() + 8 * 60 * 60 * 1000);

    const year = local.getUTCFullYear();
    const month = pad(local.getUTCMonth() + 1);
    const day = pad(local.getUTCDate());
    const hours = pad(local.getUTCHours());
    const minutes = pad(local.getUTCMinutes());
    const seconds = pad(local.getUTCSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`;
}

/**
 * 
 * @param {string} markdown 
 */
function sperateFrontmatter(markdown) {
    const frontmatter = markdown.slice(markdown.indexOf('---'), markdown.lastIndexOf('---') + 3);
    const content = markdown.slice(markdown.lastIndexOf('---') + 3);
    return { frontmatter, content };
}

/**
 * 
 * @param {string} markdown 
 */
function render(markdown) {
    let final = markdown;
    final = final.replaceAll("${date}", toISOStringOffsetUTC8(new Date(Date.now())));
    return final;
}

export {
    toISOStringOffsetUTC8,
    sperateFrontmatter,
    render,
}
