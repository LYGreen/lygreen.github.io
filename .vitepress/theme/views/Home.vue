<script setup lang="ts">

import { useData, useRoute, useRouter } from 'vitepress';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import Profile from '../component/Profile.vue';
import axios from 'axios';

interface Post {
    title?: string,
    description?: string,
    createdTime?: string,
    updatedTime?: string,
    readingTime?: number,
    category?: string[],
    tag?: string[],
    originBasename?: string,
    url?: string,
}

interface PostsPageInfo {
    postsPerPage: number,
    totalPages: number,
    length: number,
}

const base = (import.meta as any).env.BASE_URL;
const data = useData();
const router = useRouter();

let _postsPageInfo: PostsPageInfo = {} as PostsPageInfo;
let _posts: Post[] = [];

const posts = ref<Post[]>([]);
const currentPage = ref<number>(1);
const pagination = ref<Array<any>>([]);

onMounted(async () => {
    getCurrentPageNumber();
    await Promise.all([
        
        requestPageInfo(),
        requestPosts(),
    ]);

    loadPosts();
    loadPagination();

    router.onAfterRouteChange = (to) => {
        if (to == "/") {
            setPage(1);
        } else {
            const match = to.match(/^\/page\/(\d+)$/);
            if (match != null) {
                setPage(Number.parseInt(match[1]))
            }
        }
    }

    router.onAfterRouteChange(window.location.pathname + window.location.search);
});

onUnmounted(() => {
    router.onAfterRouteChange = undefined;
});

async function setPage(page: number) {
    currentPage.value = page;
    await Promise.all([
        requestPosts()
    ]);
    loadPosts();
    loadPagination();
};

// ChatGPT
function getPagination(currentPage: number, totalPages: number, delta = 2) : Array<any> {
    const pages: Array<any> = [];
    const range: Array<any> = [];

    // 总页数小于等于显示页码数量时全部展示
    // 中间显示的页数 + 首页尾页，此处没有省略号页
    if (totalPages <= 1 + 2 * delta + 2) {
        for (let i = 1; i <= totalPages; i++) {
            range.push(i);
        }
    } else {
        // 中间显示的页数的最左边的页数
        const left = Math.max(2, currentPage - delta);

        // 中间显示的页数的最右边的页数
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push(1); // 首页

        if (left > 2) {
            range.push("...");
        }

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < totalPages - 1) {
            range.push("...");
        }

        range.push(totalPages); // 尾页
    }

    return range;
}

function getCurrentPageNumber() {
    const relativePath = data.page.value.relativePath;

    if (relativePath === "index.md") {
        currentPage.value = 1;
    } else {
        const match = relativePath.match(/^page\/(\d+).md$/);
        currentPage.value = match ? Number.parseInt(match[1]) : 1;
    }
}

async function requestPageInfo() {
    await axios.get(base + "json/posts-page-info.json").then((response) => {
        _postsPageInfo = response.data;
    });
    
}

async function requestPosts() {
    let postsUrl = base + "json/posts-page-" + currentPage.value + ".json";

    await axios.get(postsUrl).then((response) => {
        _posts = response.data;
    })
}

function loadPosts() {
    posts.value = _posts;
}

function loadPagination() {
    pagination.value = getPagination(currentPage.value, _postsPageInfo.totalPages);
}

</script>

<template>
    <div id="home">
        <Profile />
        <div class="articles">
            <div class="item" v-for="(item, index) in posts" v-bind:key="index">
                <a class="header" :href="base + item.url">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                </a>
                <a class="footer">
                    <div class="category">
                        <a :href="base + 'category/' + i" v-for="(i, idx) in item.category" v-bind:key="idx">
                            {{ i }}
                        </a>
                    </div>
                    <div class="tag">
                        <a :href="base + 'tag/' + i" v-for="(i, idx) in item.tag" v-bind:key="idx">
                            {{ i }}
                        </a>
                    </div>
                </a>
            </div>

            <div class="pagination">
                <a :href="item == 1 ? base : (item == '...' ? '' : base + 'page/' + item)" v-for="(item, index) in pagination" v-bind:key="index" :class="{ active: item == currentPage }">
                    {{ item }}
                </a>
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>

@use '@/global';

#home {
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    gap: 48px;

    @include global.home-padding;
}

@media (max-width: global.$phone-width) {
    #home {
        align-items: unset;
        flex-direction: column;
        gap: 16px;
        padding: 16px 16px 16px 16px;
    }
}

.articles {
    display: flex;
    flex-direction: column;
    gap: 20px;

    flex: 1;
}

.item {
    padding: 16px 32px 16px 32px;

    /* theme */
    background-color: var(--primary-color-transparent);

    display: flex;
    flex-direction: column;

    
    box-shadow: var(--float-component-shadow);

    border-radius: global.$primary-border-radius;

    transition: transform 0.3s ease, var(--transition-attribute, background-color 0s);
    
    &:hover {
        transform: translateY(-6px);
    }

    .header {
        flex: 1;
    }

    .footer {
        bottom: 0px;
    }

    .footer a {
        padding: 8px 8px 8px 8px;
        border-radius: 8px;
        
        box-shadow: var(--float-component-shadow);
        transition: transform 0.3s ease, var(--transition-attribute, background-color 0s);

        &:hover {
            transform: translateY(-6px);
        }
    }
}

.category {
    float: left;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 8px;
}

.tag {
    float: right;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 8px;
}

.pagination {
    display: flex;
    flex-direction: row;

    a {
        background-color: var(--secondary-color-transparent);
        box-shadow: var(--float-component-shadow);
        
        display: block;
        padding: 12px 12px 12px 12px;
        border-radius: 8px;
        
        transition: transform 0.3s ease;

        &:hover {
            transform: translateY(-6px);
        }
    }

    .active {
        background-color: var(--primary-color-transparent);
    }
}

</style>
