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
    <div class="github-profile">
        <div class="avatar">
            <img :src="user.avatar_url" alt="avatar">
        </div>
        <h2 class="name">{{ user.name }}</h2>
        <p class="login">{{ user.login }}</p>
        <p class="bio">{{ user.bio }}</p>
        <hr>
        <span class="follow medium">{{ user.followers }} followers · {{ user.following }} following</span>
        <span class="small gray">Created at: {{ user.created_at }}</span>
        <span class="small gray">Updated at: {{ user.updated_at }}</span>
        <div style="margin-top:15px;">
            <a :href="user.html_url" target="_blank" style="font-size: 1.2em; margin: 0 5px; color: #555;">
                <i class="fab fa-github" style="font-size: 1.2em; margin: 0 5px; color: #555;"></i>
            </a>
            <a href="/rss.xml" target="_blank">
                <i class="fas fa-rss" style="color: #FF6600; font-size: 1.2em;"></i>
            </a>
        </div>
    </div>
</template>

<style scoped>
span {
    display: block;
}

.medium {
    font-size: medium;
}

.small {
    font-size: 12px;
}

.gray {
    color: gray;
}

/* ===== 个人信息 ===== */
.name {
    margin-bottom: 0;
}

.login {
    margin-top: 0;
}

.github-profile {
    background: var(--card-bg);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: var(--shadow);
    border: 2px solid white;
    text-align: center;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid var(--primary-pink);
    margin: 0 auto 10px;
    background-color: #eee;
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
