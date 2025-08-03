<script setup lang="ts">

import { ref, onMounted } from 'vue';
import axios from 'axios';

interface User {
    avatarUrl: string,
    bio: string,
}

let _user: any;

const user = ref<User>({} as User);

onMounted(async () => {
    await Promise.all([
        requestUserInfo(),
    ]);
    loadUserInfo();
});

async function requestUserInfo() {
    await axios.get("https://api.github.com/users/LYGreen").then((response) => {
        _user = response.data;
    });
}

function loadUserInfo() {
    user.value.avatarUrl = _user.avatar_url ?? "";
    user.value.bio = _user.bio ?? "";
}

</script>

<template>
    <div class="profile">
        <div class="avatar">
            <a href="#">
                <img :src="user.avatarUrl" alt="">
            </a>
            <span class="emoji">🍥</span>
        </div>
        <span>{{ user.bio }}</span>
    </div>
</template>

<style lang="scss" scoped>

@use "@/_global.scss";

.profile {
    
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    padding: 16px 16px 16px 16px;
    border-radius: 12px;
    
    position: sticky;
    top: calc(50px + 48px);
    width: 240px;
    flex-shrink: 0;
    
    background-color: var(--primary-color-transparent);
    box-shadow: var(--float-component-shadow);

    .avatar {
        position: relative;
    }

    .emoji {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 32px;
        height: 32px;
        background-color: var(--secondary-color);
        box-shadow: var(--float-component-shadow);
        text-align: center;
        line-height: 32px;
        border-radius: 50%;
    }

    img {
        box-shadow: var(--float-component-shadow);
        aspect-ratio: 1;
        width: 128px;
        border-radius: 50%;
    }
}

@media (max-width: global.$phone-width) {
    .profile {
        position: unset;
        width: unset;
        top: 0px;
        flex: 1;
    }
}

</style>

