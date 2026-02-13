<script setup lang="ts">

const { date } = defineProps<{
    date: Date
}>();

</script>

<template>
    <span>{{ date.toLocaleString() }}</span>
</template>
