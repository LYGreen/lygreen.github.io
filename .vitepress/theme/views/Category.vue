<script setup lang="ts">

import { useData } from 'vitepress';
import { ref, onMounted } from 'vue';
import axios from 'axios';

import Profile from '../component/Profile.vue';

interface ElementPageInfo {
    elementsPerPage: number,
    totalPages: number,
    length: number,
}

const base = (import.meta as any).env.BASE_URL;
const data = useData();

let _categoryPageInfo: ElementPageInfo = {} as ElementPageInfo;
let _category: string[] = [];
let _loadedPage = 0;

const category = ref<string[]>([]);

onMounted(async () => {
    await Promise.all([
        requestCategoryInfo(),
        requestCategory(),
    ]);
    appendCategories();
    lazyLoadCategories();
});

async function requestCategoryInfo() {
    const response = await axios.get(base + "json/category/category-page-info.json");
    _categoryPageInfo = response.data;
}

async function requestCategory() {
    _category.splice(0, _category.length); /* 清空数组 */
    const response = await axios.get(base + "json/category/category-page-" + (_loadedPage + 1) + ".json");
    _category = response.data;
}

function appendCategories() {
    if (_category.length > 0) {
        category.value.push(..._category);
        _loadedPage++;
    }
}

function lazyLoadCategories() {
    const intersectionObserver = new IntersectionObserver(async (entries) => {
        if (entries[0].intersectionRatio > 0 && _loadedPage < _categoryPageInfo.totalPages) {
            await requestCategory();
            appendCategories();
        }
    });
    intersectionObserver.observe(document.getElementsByClassName("loadding-trigger")[0]);
}

</script>

<template>
    <div id="category">
        <Profile />
        <div class="items">
            <a :href="base + 'category/' + item" class="item" v-for="(item, index) in category" v-bind:key="index">
                {{ item }}
            </a>
            <div class="loadding-trigger" style="flex-basis: 100%;"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

@use "@/_global.scss";

#category {
    @include global.home-padding;
    
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    gap: 48px;
}

@media (max-width: 768px) {
    #category {
        align-items: unset;
        flex-direction: column;
        gap: 16px;
        padding: 16px 16px 16px 16px;
    }

    .item {
        flex-grow: 1;
    }
}

.items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
}

.item {
    background-color: var(--primary-color-transparent);
    box-shadow: var(--float-component-shadow);

    display: block;
    width: 142px;
    height: 96px;
    border-radius: 12px;
    
    text-align: center;
    line-height: 96px;

    transition: transform 0.3s ease, var(--transition-attribute, background-color 0s);
}

.item:hover {
    transform: translateY(-6px);
}

</style>
