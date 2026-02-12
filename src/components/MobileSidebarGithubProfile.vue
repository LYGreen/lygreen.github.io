<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

interface GithubUser {
    login?: string,
    avatar_url?: string,
    url?: string,
    html_url?: string,
    name?: string,
    bio?: string,
    followers?: number,
    following?: number,
    created_at?: string,
    updated_at?: string
}

const { link } = defineProps<{
    link: string,
}>();

const user = reactive<GithubUser>({});

onMounted(async () => {
    const response = await fetch(link);
    const data = await response.json();
    Object.assign(user, data);
});

</script>

<template>
    <div class="github-profile" v-if="Object.keys(user).length !== 0">

        <div class="avatar">
            <img :src="user.avatar_url" alt="avatar">
        </div>
        <h2 class="name">{{ user.name }}</h2>
        <p class="login">{{ user.login }}</p>
        <p class="bio">{{ user.bio }}</p>
        <div class="links">
            <a :href="user.html_url" target="_blank" style="font-size: 1.2em; color: #555;">
                <i class="fab fa-github" style="font-size: 1.2em; color: #555;"></i>
            </a>
            <a href="/rss.xml" target="_blank">
                <i class="fas fa-rss" style="color: #FF6600; font-size: 1.2em;"></i>
            </a>
        </div>
    </div>
</template>

<style scoped>
    /* ===== 个人信息 ===== */
    .github-profile {
        margin-bottom: 10px;
        border-bottom: 2px dashed var(--primary-pink);
    }

    .links {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5px 0;
        gap: 8px;
    }

    .avatar, .name, .login {
        margin: 0 auto;
        text-align: center;
    }

    .name {
        font-size: 24px;
    }

    .login {
        font-size: 18px;
    }

    .bio {
        text-align: left;
        width: fit-content;
        margin: 8px auto;
        font-size: 16px;
    }

    .avatar {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        border: 4px solid var(--primary-pink);
        background-color: #eee;
        overflow: hidden;
    }

    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
