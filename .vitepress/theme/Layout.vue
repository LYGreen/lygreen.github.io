<script setup lang="ts">
import { useData } from 'vitepress'

import AppHeader from './component/Header.vue'
import AppFooter from './component/Footer.vue';

import Home from './views/Home.vue';
import Category from './views/Category.vue';
import CategoryPage from './views/CategoryPage.vue';
import Tag from './views/Tag.vue';
import TagPage from './views/TagPage.vue';
import AppArticle from './views/Article.vue';
import ArticleTOC from './views/ArticleTOC.vue';
import Articles from './views/Articles.vue';
import Page404 from './views/Page404.vue';

const { site, page, frontmatter } = useData()


</script>

<template>
    <div id="layout">
        <header>
            <AppHeader />
        </header>
        <main>
            <Page404 v-if="page.isNotFound" />
            <Home v-else-if="frontmatter.layout === 'home'" />
            <Articles v-else-if="frontmatter.layout === 'articles'" />
            <Category v-else-if="frontmatter.layout === 'category'" />
            <CategoryPage v-else-if="frontmatter.layout === 'category-page'" />
            <Tag v-else-if="frontmatter.layout === 'tag'" />
            <TagPage v-else-if="frontmatter.layout === 'tag-page'" />
            <AppArticle v-else />
            <!-- <div id="h-container" v-else> -->
                <!-- <AppArticle /> -->
                <!-- <ArticleTOC /> -->
            <!-- </div> -->
        </main>
        <footer>
            <AppFooter />
        </footer>
    </div>
</template>

<style scoped>

#layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

header {
    position: sticky;
    top: 0px;
    z-index: 999;
}

main {
    flex: 1;
}

#h-container {
    display: flex;
    width: calc(100% - 40px);
    gap: 16px;
    flex-direction: row;
    min-height: calc(100% - 50px);
    padding-left: 20px;
    padding-right: 20px;
}

</style>
