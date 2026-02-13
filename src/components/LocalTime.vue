<script setup lang="ts">
import { onMounted, ref } from 'vue';

const { date } = defineProps<{
    date: Date
}>();

const placeholder = ref('Loading...');

onMounted(() => {
    placeholder.value = date.toLocaleString();
});

</script>

<template>
    <span>{{ placeholder }}</span>
</template>
