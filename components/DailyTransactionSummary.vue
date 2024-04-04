<template>
  <div
    class="grid grid-cols-2 pb-2 border-b border-gray-200 dark:border-neutral-700 text-neutral-500 dark:text-gray-400 font-bold"
  >
    <div class="flex items-center justify-between">{{ date }}</div>
    <div class="flex items-center justify-end mr-10">{{ currency }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  date: String,
  transactions: Array,
});

const sum = computed(() => {
  return props.transactions.reduce(
    (accumulator, value) =>
      value.type === "Income"
        ? accumulator + value.amount
        : accumulator - value.amount,
    0,
  );
});

const { currency } = useCurrency(sum);
</script>
