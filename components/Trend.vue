<template>
  <div :class="['p-2', 'trend-container', `container-${color}`]">
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div v-else class="text-gray-600 dark:text-gray-300">{{ currency }}</div>
    </div>

    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="{ green: trendingUp, red: !trendingUp }"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ trendingRate }}% vs last period
        </div>
      </div>
    </div>
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

const { amount } = toRefs(props);
const trendingUp = computed(() => props.amount >= props.lastAmount);

const icon = computed(() => {
  return trendingUp.value
    ? "i-heroicons-arrow-trending-up"
    : "i-heroicons-arrow-trending-down";
});

const { currency } = useCurrency(amount);

const trendingRate = computed(() => {
  const diff = props.amount - props.lastAmount;
  return Math.round((Math.abs(diff) * 100) / props.lastAmount);
});

// const hoverClass = computed(() => `border-b-4 hover:border-${props.color}-500`);
const hoverClass = computed(
  () => `border-b-0 hover:border-${props.color}-400 hover:border-b-4`,
);
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}

.trend-container {
  @apply border-b-2 border-white dark:border-neutral-800 hover:cursor-pointer;

  &.container-green {
    &:hover {
      /* @apply border-b-4 border-green-400 bg-gradient-to-b from-green-100 dark:from-green-900 */
      /* via-transparent dark:via-transparent; */
      @apply border-b-2 border-green-400;
    }
  }
  &.container-red {
    &:hover {
      /* @apply border-b-4 border-red-400 bg-gradient-to-t from-red-100 dark:from-red-900 */
      /* via-transparent dark:via-transparent; */
      @apply border-b-2 border-red-400;
    }
  }
}
</style>
