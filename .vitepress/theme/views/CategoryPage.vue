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

let _currentCategory: string = "";
let _categoriesPageInfo: CategoriesPageInfo = {} as CategoriesPageInfo;
let _posts: Post[] = [];
let _loadedPage = 0;
let _intersectionObserver: IntersectionObserver = {} as IntersectionObserver;

const currentCategory = ref<string>("");
const posts = ref<Post[]>([]);

onMounted(async () => {
    _currentCategory = data.params.value?.category;
    await requestPageInfo();
    _intersectionObserver = new IntersectionObserver(observerCallback);
    _intersectionObserver.observe(document.getElementsByClassName("loadding-trigger")[0]);
    currentCategory.value = _currentCategory;
});

onUnmounted(() => {
    _intersectionObserver.disconnect();
});

function observerReset() {
    _intersectionObserver.disconnect();
    // _intersectionObserver = new IntersectionObserver(observerCallback);
    _intersectionObserver.observe(document.getElementsByClassName("loadding-trigger")[0]);
}

async function observerCallback(entries: IntersectionObserverEntry[]) {
    if (entries[0].intersectionRatio > 0 && _loadedPage < _categoriesPageInfo.totalPages) {
        const received = await requestPosts();
        if (received) {
            posts.value.push(..._posts);
            _loadedPage++;
            observerReset();
        }
    }
}

async function requestPageInfo() {
    const response = await axios.get(base + "json/category/" + _currentCategory + "/posts-page-info.json");
    _categoriesPageInfo = response.data;
}

async function requestPosts() {
    const response = await axios.get(base + "json/category/" + _currentCategory + "/posts-page-" + (_loadedPage + 1) + ".json");
    if (response.status == 200 || response.status == 304) {
        _posts = response.data;
        return true;
    }
    return false;
}

async function setCurrentCategory(category: string) {
    _currentCategory = category;
    await requestPageInfo();
    _loadedPage = 0;
    observerReset();
    posts.value.splice(0, posts.value.length);
    currentCategory.value = _currentCategory;
}

</script>

<template>
    <div id="category-page">
        <Profile />
        <div class="items">
            <div class="header">
                当前分类：{{ currentCategory }}
            </div>
            <div class="item" v-for="(item, index) in posts" v-bind:key="index">
                <a class="item-header" :href="base + item.url">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                </a>
                <a class="item-footer">
                    <div class="category">
                        <a @click="i == currentCategory ? '' : setCurrentCategory(i)" :href="base + 'category/' + i" v-for="(i, idx) in item.category" v-bind:key="idx">
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

#category-page {
    @include global.home-padding;

    display: flex;
    align-items: flex-start;
    flex-direction: row;
    gap: 48px;
}

@media (max-width: global.$phone-width) {
    #category-page {
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
