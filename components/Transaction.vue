<script setup>
const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(["deleted", "edited"]);

const isIncome = computed(() => props.transaction.type === "Income");
const icon = computed(() =>
  isIncome.value ? "i-heroicons-arrow-up-right" : "i-heroicons-arrow-down-left",
);

const iconColor = computed(() =>
  isIncome.value ? "text-green-600" : "text-red-600",
);

const { currency } = useCurrency(props.transaction.amount);

const isLoading = ref(false);
const { toastError, toastSuccess } = useAppToast();

const isOpen = ref(false)

// backend querying
const supabase = useSupabaseClient();

const deleteTransaction = async () => {
  isLoading.value = true;

  try {
    await supabase.from("transaction").delete().eq("id", props.transaction.id);
    toastSuccess({
      title: "Transaction deleted",
    });
    emit("deleted", props.transaction.id);
  } catch (error) {
    toastError({
      title: "Delete request rejected",
    });
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => isOpen.value = true,
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];
</script>

<template>
  <div class="transaction-container">
    <div class="flex items-center justify-between gap-x-4 col-span-2">
      <div class="flex items-center gap-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="white" v-if="transaction.category">{{
          transaction.category
          }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end gap-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading" />
          <TransactionModal v-model="isOpen" :transaction="transaction" @saved="emit('edited')" />
        </UDropdown>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.transaction-container {
  @apply grid grid-cols-3 py-2 px-2 border-b border-gray-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700;

  &:hover button {
    @apply bg-white dark:bg-black;
  }
}
</style>
