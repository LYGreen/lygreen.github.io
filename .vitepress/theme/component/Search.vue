<script lang="ts" setup>

import { useRouter } from 'vitepress';
import { ref } from 'vue';

const router = useRouter();
const searchText = ref("");

function gotoSearchPage() {
    if (searchText.value == "") {
        return;
    }
    router.go(`/search?value=${searchText.value}`);
}

</script>

<template>
    <div id="search">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-search">
            <circle cx="10" cy="10" r="6"></circle>
            <line x1="15.5" y1="15.5" x2="18.5" y2="18.5"></line>
        </svg>
        <input type="text" placeholder="搜索" class="text-box" @keydown.enter="gotoSearchPage" v-model="searchText"></input>
    </div>
</template>

<style lang="scss" scoped>

@use "@/_global.scss";

#search {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
    padding-left: 16px;
    padding-right: 16px;

    width: 240px;
    height: 40px;
    border-radius: global.$secondary-border-radius;
    background-color: var(--tertiary-color-transparent);
}

@media (max-width: global.$phone-width) {
    #search {
        width: 160px;
    }
}

.feather-search {
    flex-shrink: 0;
}

.text-box {
    font-size: 16px;
    border-style: none;
    width: 100%;
    color: var(--primary-text-color);
    background-color: rgba(0, 0, 0, 0);
    flex: 1;

    &:focus {
        outline: none;
    }
}

.text-box::placeholder {
    color: var(--tertiary-text-color);
}

</style>
