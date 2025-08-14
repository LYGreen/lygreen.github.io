<script lang="ts" setup>

import { useData, useRoute, useRouter } from 'vitepress';
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import Profile from '../component/Profile.vue';

interface PostsPageInfo {
    postsPerPage: number,
    totalPages: number,
    length: number,
}

interface Post {
    title: string,
    description: string,
    createdTime: string,
    updatedTime: string,
    readingTime: 2,
    category: string[],
    tag: string[],
    originBasename: string,
    url: string,
}

const base = (import.meta as any).env.BASE_URL;
const data = useData();
const route = useRoute();
const router = useRouter();

let _postsPageInfo: PostsPageInfo;
let _posts: Post[] = [];
let _loadedPage = 0;
let _intersectionObserver: IntersectionObserver = {} as IntersectionObserver;
let _searchText = "";

const posts = ref<Post[]>([]);
const searchText = ref("");

onMounted(async () => {
    await requestPageInfo();
    _intersectionObserver = new IntersectionObserver(observerCallback);

    router.onBeforePageLoad = (to) => {
        _intersectionObserver.disconnect();
    }
    
    router.onAfterRouteChange = (to) => {
        reloadPage();
        _intersectionObserver.observe(document.getElementsByClassName("loadding-trigger")[0]);
    }

    // 参数可以忽略，因为没有用到
    router.onAfterRouteChange(window.location.pathname + window.location.search);
});

onUnmounted(() => {
    router.onBeforePageLoad = undefined;
    router.onAfterRouteChange = undefined;
});

function reloadPage() {
    const params = new URLSearchParams(window.location.search);
    _searchText = params.get("value") as string;

    _loadedPage = 0;
    posts.value.splice(0, posts.value.length);
    searchText.value = _searchText;
}

function observerReset() {
    _intersectionObserver.disconnect();
    _intersectionObserver.observe(document.getElementsByClassName("loadding-trigger")[0]);
}

async function observerCallback(entries: IntersectionObserverEntry[]) {
    if (entries[0].intersectionRatio > 0 && _loadedPage < _postsPageInfo.totalPages) {
        const received = await requestPosts();
        if (received) {
            posts.value.push(..._posts);
            _loadedPage++;
            observerReset();
        }
    }
}

async function requestPageInfo() {
    const response = await axios.get(`${base}json/posts-page-info.json`);
    _postsPageInfo = response.data;
}

async function requestPosts() {
    const response = await axios.get(`${base}json/posts-page-${_loadedPage + 1}.json`);
    if (response.status == 200 || response.status == 304) {
        
        const data: Post[] = response.data;
        _posts.splice(0, _posts.length);
        for (let i = 0; i < data.length; i++) {
            /* 无视大小写搜索 */
            if (
                data[i].title.toLowerCase().includes(_searchText.toLowerCase()) ||
                data[i].description.toLowerCase().includes(_searchText.toLowerCase())
            ) {
                _posts.push(data[i]);
            }
        }
        // console.log(_posts, _loadedPage);
        return true;
    }
    return false;
}

</script>

<template>
    <div id="search-page">
        <Profile />
        <div class="items">
            <div class="header">
                {{ `关键词 "${searchText}" 搜索结果` }}
            </div>
                        <div class="item" v-for="(item, index) in posts" v-bind:key="index">
                <a class="item-header" :href="base + item.url">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                </a>
                <a class="item-footer">
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
            <div class="loadding-trigger"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

@use "@/_global.scss";

#search-page {
    @include global.home-padding;

    display: flex;
    align-items: flex-start;
    flex-direction: row;
    gap: 48px;
}

@media (max-width: global.$phone-width) {
    #search-page {
        align-items: unset;
        flex-direction: column;
        gap: 16px;
        padding: 16px 16px 16px 16px;
    }
}

.items {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 20px;
}

.header {
    background-color: var(--primary-color-transparent);
    box-shadow: var(--float-component-shadow);
    border-radius: 12px;
    padding: 16px 16px 16px 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
}

.item {
    display: flex;
    flex-direction: column;

    background-color: var(--primary-color-transparent);
    box-shadow: var(--float-component-shadow);
    padding: 16px 32px 16px 32px;
    border-radius: 12px;

    transition: transform 0.3s ease, var(--transition-attribute, background-color 0s);

    &:hover {
        transform: translateY(-6px);
    }

    .item-header {
        flex: 1;
    }

    .item-footer {
        bottom: 0px;

        a {
            padding: 8px 8px 8px 8px;
            border-radius: 8px;
            
            box-shadow: var(--float-component-shadow);
            transition: transform 0.3s ease, var(--transition-attribute, background-color 0s);

            &:hover {
                transform: translateY(-6px);
            }
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

</style>
