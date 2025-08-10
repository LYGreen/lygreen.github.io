<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { Content, useData } from 'vitepress';
import theme from 'vitepress/theme';

interface ToCItem {
    level: string,
    content: string,
    url: string,
}

const base = (import.meta as any).env.BASE_URL;
const data = useData();
const { frontmatter } = useData();

onMounted(() => {
    buildToC();
    loadDiscussion();
    listenTheme();
});

// 根据 ChatGPT 给出的代码进行修改
function buildToC() {
    const content = document.getElementsByClassName("content-body")[0];
    const toc = document.getElementsByClassName("toc")[0];
    // const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const headings = content.querySelectorAll("h1, h2, h3");
    
    const tocList = document.createElement("ul");

    const counters = [0, 0, 0, 0, 0, 0];
    
    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        
        counters[level - 1]++;
        for (let i = level; i < 6; i++) {
            counters[i] = 0;
        }

        const numberParts = counters.slice(0, level).filter(n => n > 0);
        const numberPrefix = numberParts.join(".");

        const li = document.createElement("li");
        li.style.paddingLeft = `${(level - 1) * 20}px`;

        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = `${numberPrefix}. ${heading.textContent}`;

        li.appendChild(link);
        tocList.appendChild(li);
    });

    toc.appendChild(tocList);
}

function loadDiscussion() {
    // script src="https://giscus.app/client.js"
    //     data-repo="LYGreen/lygreen.github.io"
    //     data-repo-id="R_kgDOPH1RXg"
    //     data-category="Article discussions"
    //     data-category-id="DIC_kwDOPH1RXs4CsjU0"
    //     data-mapping="pathname"
    //     data-strict="0"
    //     data-reactions-enabled="1"
    //     data-emit-metadata="0"
    //     data-input-position="bottom"
    //     data-theme="preferred_color_scheme"
    //     data-lang="zh-CN"
    //     crossorigin="anonymous"
    //     async>
    // /script>

    const theme = document.documentElement.getAttribute('data-theme') ?? 'light';
    const comments = document.getElementById('comments');
    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    script.setAttribute('data-repo', "LYGreen/lygreen.github.io");
    script.setAttribute('data-repo-id', "R_kgDOPH1RXg");
    script.setAttribute('data-category', "Article discussions");
    script.setAttribute('data-category-id', "DIC_kwDOPH1RXs4CsjU0");
    script.setAttribute('data-mapping', "pathname");
    script.setAttribute('data-strict', "0");
    script.setAttribute('data-reactions-enabled', "1");
    script.setAttribute('data-emit-metadata', "0");
    script.setAttribute('data-input-position', "bottom");
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', "zh-CN");
    script.crossOrigin = 'anonymous';
    script.async = true;
    comments?.appendChild(script);
}

function listenTheme() {
    const element = document.documentElement;
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.type === 'attributes' && m.attributeName === 'data-theme') {
                sendMessage({
                    setConfig: {
                        theme: element.getAttribute(m.attributeName),
                    }
                });
            }
        }
    });
    observer.observe(element, {
        attributes: true,
    });
}

function sendMessage(message) {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!iframe) {
        return;
    }
    console.log(iframe.contentWindow);
    iframe.contentWindow?.postMessage({
        giscus: message,
    }, 'https://giscus.app');
}

</script>

<template>
    <div id="article">
        <div class="toc">
            <input type="checkbox" id="toc-toggle" hidden></input>
            <label for="toc-toggle"><strong>目录</strong></label>
            <hr></hr>
            
        </div>
        <div class="content">
            <div class="content-header">
                <h2>{{ frontmatter.title }}</h2>
                <p>{{ frontmatter.description }}</p>
                <div class="header-elements">
                    <div>📅创建时间：{{ frontmatter.createdTime }}</div>
                    <div>🕒修改时间：{{ frontmatter.updatedTime }}</div>
                    <div>📖阅读时间：{{ frontmatter.readingTime }} 分钟</div>
                </div>
            </div>
            <hr></hr>
            <Content class="content-body" />
            <hr></hr>
            <div class="content-footer">
                <div class="header-elements">
                    <div>📅创建时间：{{ frontmatter.createdTime }}</div>
                    <div>🕒修改时间：{{ frontmatter.updatedTime }}</div>
                    <div>📖阅读时间：{{ frontmatter.readingTime }} 分钟</div>
                </div>
            </div>
            <hr></hr>
            <div id="comments"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

@use "@/_global.scss";

#article {
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    gap: 48px;

    @include global.article-padding;
}

.toc {


    display: flex;
    flex-direction: column;

    gap: 20px;

    padding: 16px 16px 16px 16px;
    border-radius: 12px;
    
    position: sticky;
    top: calc(50px + 48px);
    width: 240px;
    flex-shrink: 0;

    background-color: var(--primary-color);
    box-shadow: var(--float-component-shadow);

    hr {
        width: 99.56%;
    }

    label {
        text-align: center;
        width: 100%;
    }

    :deep(ul li a) {
        color: var(--main-text-color);
        transition: color 0.3s ease;

        &:hover {
            color: gray;
        }
    }

    :deep(ul, ol, li) {
        padding-left: 0px;
        margin-top: 0px;
        margin-bottom: 0px;
        text-decoration: none;
        list-style: none;
    }
}

@media (max-width: global.$phone-width) {
    #article {
        align-items: unset;
        flex-direction: column;
        padding: 16px 16px 16px 16px;
        gap: 16px;
    }

    .toc {
        position: unset;
        width: unset;
        flex: 1;
    }

    #toc-toggle :deep(~ ul) {
        display: none;
    }

    #toc-toggle:checked :deep(~ ul) {
        display: unset;
    }
}

.content {
    background-color: var(--primary-color);
    box-shadow: var(--float-component-shadow);
    
    flex: 1;
    overflow-x: auto;

    padding: 16px 32px 16px 32px;
    border-radius: 12px;

    .content-header .header-elements {
        flex: 1;
    }
    
    .content-body {
        :deep(.vp-adaptive-theme) {
            position: relative;

            padding: 8px 8px 8px 8px;
            border-radius: 12px;

            background-color: var(--secondary-color);
        }

        :deep(.copy) {
            float: right;
            border-radius: 4px;
            border-width: 0px;
            background-color: var(--primary-color);
            box-shadow: var(--float-component-shadow);
            color: var(--main-text-color);
            transition: background-color 0.3s ease, color 0.3s ease;

            &:hover {
                background-color: var(--secondary-color);
            }

            &::after {
                content: "复制代码";
            }
        }

        :deep(.copied::after) {
            content: "复制成功";
        }

        :deep(.custom-block) {
            border-radius: 12px;
            box-shadow: var(--float-component-shadow);
            
            .custom-block-title {
                padding-top: 16px;
                padding-bottom: 0px;
            }

            p {
                padding: 0px 16px 16px 16px;
            }
        }

        :deep(.info) {
            background-color: var(--blue);

            .custom-block-title::before, .custom-block-title::after {
                content: "ℹ️";
            }
        }

        :deep(.tip) {
            background-color: var(--green);

            .custom-block-title::before, .custom-block-title::after {
                content: "💡";
            }
        }

        :deep(.warning) {
            background-color: var(--orange);

            .custom-block-title::before, .custom-block-title::after {
                content: "⚠️";
            }
        }

        :deep(.danger) {
            background-color: var(--red);

            .custom-block-title::before, .custom-block-title::after {
                content: "🚨";
            }
        }

        :deep(.details) {
            background-color: var(--purple);

            summary {
                padding: 16px 16px 16px 16px;
            }

            summary::before {
                content: "📄";
            }

            p {
                margin-top: 0px;
            }
        }

        :deep(a) {
            display: inline-block;
            text-decoration: underline;
            transition: transform 0.3s ease, color 0.3s ease;
        }

        :deep(a:hover) {
            transform: translateY(-2px);
            color: gray;
        }

        :deep(img) {
            max-width: 100%;
        }

        :deep(.vp-code) {
            overflow-x: auto;
        }

        :deep(ol), :deep(ul) {
            padding-inline-start: 24px;
        }
    }
}

:root #article :deep(.content span) {
    color: var(--shiki-light);
}

:root[data-theme='dark'] #article :deep(.content span) {
    color: var(--shiki-dark);
}

</style>
