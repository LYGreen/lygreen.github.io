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

let _tagPageInfo: ElementPageInfo = {} as ElementPageInfo;
let _tag: string[] = [];
let _loadedPage = 0;

const tag = ref<string[]>([]);

onMounted(async () => {
    await Promise.all([
        requestTagInfo(),
        requestTag(),
    ]);
    appendTags();
    lazyLoadTags();
});

async function requestTagInfo() {
    const response = await axios.get(base + "json/tag/tag-page-info.json");
    _tagPageInfo = response.data;
}

async function requestTag() {
    _tag.splice(0, _tag.length); /* 清空数组 */
    const response = await axios.get(base + "json/tag/tag-page-" + (_loadedPage + 1) + ".json");
    _tag = response.data;
}

function appendTags() {
    if (_tag.length > 0) {
        tag.value.push(..._tag);
        _loadedPage++;
    }
}

function lazyLoadTags() {
    const intersectionObserver = new IntersectionObserver(async (entries) => {
        if (entries[0].intersectionRatio > 0 && _loadedPage < _tagPageInfo.totalPages) {
            await requestTag();
            appendTags();
        }
    });
    intersectionObserver.observe(document.getElementsByClassName("loadding-trigger")[0]);
}

</script>

<template>
    <div id="tag">
        <Profile />
        <div class="items">
            <a :href="base + 'tag/' + item" class="item" v-for="(item, index) in tag" v-bind:key="index">
                {{ item }}
            </a>
            <div class="loadding-trigger" style="flex-basis: 100%;"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

@use "@/_global.scss";

#tag {
    @include global.home-padding;

    display: flex;
    align-items: flex-start;
    flex-direction: row;
    gap: 48px;
}

@media (max-width: global.$phone-width) {
    #tag {
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

    &:hover {
        transform: translateY(-6px);
    }
}

</style>
