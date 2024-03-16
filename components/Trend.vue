<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
});
</script>

<style lang="scss" scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply;
}
</style>
