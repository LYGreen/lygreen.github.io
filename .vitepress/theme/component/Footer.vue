<script setup>

import { ref, onMounted } from 'vue';

const year = ref('');

onMounted(() => {
    year.value = new Date(Date.now()).getFullYear();
});

</script>

<template>
    <div id="footer">
        <hr>
        <span>版权所有 © {{ year }} LYGreen。保留所有权利。</span>
        <span>Copyright © {{ year }} LYGreen. All rights reserved.</span>
    </div>
</template>

<style scoped>

#footer {
    background-color: var(--primary-color-transparent);
    box-shadow: var(--float-component-shadow);

    text-align: center;
}

span {
    display: block;
}

</style>
