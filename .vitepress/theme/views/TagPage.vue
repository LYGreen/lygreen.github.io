<script setup lang="ts">

import { useData, useRouter } from 'vitepress';
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios';

import Profile from '../component/Profile.vue';

interface CategoriesPageInfo {
    currentCategory: string,
    postsPerPage: number,
    totalPages: number,
    length: number,
}

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

const base = (import.meta as any).env.BASE_URL;
const data = useData();
const router = useRouter();

let _currentTag: string = "";
let _tagsPageInfo: CategoriesPageInfo = {} as CategoriesPageInfo;
let _posts: Post[] = [];
let _loadedPage = 0;
let _intersectionObserver: IntersectionObserver = {} as IntersectionObserver;

const currentTag = ref<string>("");
const posts = ref<Post[]>([]);

onMounted(async () => {
    _currentTag = data.params.value?.tag;
    await requestPageInfo();
    _intersectionObserver = new IntersectionObserver(observerCallback);
    _intersectionObserver.observe(document.getElementsByClassName("loadding-trigger")[0]);
    currentTag.value = _currentTag;
    console.log(_tagsPageInfo);
    console.log("Mounted");
});

onUnmounted(() => {
    _intersectionObserver.disconnect();
    console.log("Unmounted");
});

function observerReset() {
    console.log(_loadedPage);
    _intersectionObserver.disconnect();
    // _intersectionObserver = new IntersectionObserver(observerCallback);
    _intersectionObserver.observe(document.getElementsByClassName("loadding-trigger")[0]);
}

async function observerCallback(entries: IntersectionObserverEntry[]) {
    console.log("callback");
    if (entries[0].intersectionRatio > 0 && _loadedPage < _tagsPageInfo.totalPages) {
        const received = await requestPosts();
        if (received) {
            posts.value.push(..._posts);
            _loadedPage++;
            observerReset();
        }
    }
}

async function requestPageInfo() {
    const response = await axios.get(base + "json/tag/" + _currentTag + "/posts-page-info.json");
    _tagsPageInfo = response.data;
}

async function requestPosts() {
    const response = await axios.get(base + "json/tag/" + _currentTag + "/posts-page-" + (_loadedPage + 1) + ".json");
    if (response.status == 200 || response.status == 304) {
        _posts = response.data;
        return true;
    }
    return false;
}

async function setCurrentTag(category: string) {
    _currentTag = category;
    await requestPageInfo();
    _loadedPage = 0;
    observerReset();
    posts.value.splice(0, posts.value.length);
    currentTag.value = _currentTag;
}

</script>

<template>
    <div id="tag-page">
        <Profile />
        <div class="items">
            <div class="header">
                当前标签：{{ currentTag }}
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
                        <a @click="i == currentTag ? '' : setCurrentTag(i)" :href="base + 'tag/' + i" v-for="(i, idx) in item.tag" v-bind:key="idx">
                            {{ i }}
                        </a>
                    </div>
                </a>
            </div>
            <div class="loadding-trigger"></div>
        </div>
    </div>
</template>

<style scoped>

#tag-page {
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    gap: 48px;
    padding-top: 48px;
    padding-left: 200px;
    padding-right: 200px;
    padding-bottom: 48px;
}

@media (max-width: 768px) {
    #tag-page {
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
    background-color: var(--main-bg-color);
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

    background-color: var(--main-bg-color);
    box-shadow: var(--float-component-shadow);
    padding: 16px 32px 16px 32px;
    border-radius: 12px;

    transition: transform 0.3s ease, var(--transition-attribute, background-color 0s);
}

.item:hover {
    transform: translateY(-6px);
}

.item-header {
    flex: 1;
}

.item-footer {
    bottom: 0px;
}

.item-footer a {
    padding: 8px 8px 8px 8px;
    border-radius: 8px;
    
    box-shadow: var(--float-component-shadow);
    transition: transform 0.3s ease, var(--transition-attribute, background-color 0s);
}

.item-footer a:hover {
    transform: translateY(-6px);
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
