<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="green"
      title="Income"
      :amount="incomeTotal"
      :last-amount="4500"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="3500"
      :loading="isLoading"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="5000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="3000"
      :loading="isLoading"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <p class="text-gray-500 dark:text-gray-400">
        You have
        {{ income.length }}
        {{ income.length > 1 ? "incomes" : "income" }} and
        {{ expense.length }}
        {{ expense.length > 1 ? "expenses" : "expense" }}
        this period
      </p>
    </div>
    <div>
      <UButton icon="i-heroicons-plus-circle" color="white" variant="solid"
        >Add</UButton
      >
    </div>
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(dayTransactions, date) in transactionsGroupedByDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary :date="date" :transactions="dayTransactions" />
      <Transaction
        v-for="transaction in dayTransactions"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";
const selectedView = ref(transactionViewOptions[1]);

const isLoading = ref(false);

const transactions = ref([]);

const income = computed(() =>
  transactions.value.filter((t) => t.type === "Income"),
);

const expense = computed(() =>
  transactions.value.filter((t) => t.type === "Expense"),
);

const incomeTotal = computed(() =>
  income.value.reduce((acc, curr) => acc + curr.amount, 0),
);

const expenseTotal = computed(() =>
  expense.value.reduce((acc, curr) => acc + curr.amount, 0),
);

// backend querying
const supabase = useSupabaseClient();

const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData("transactions", async () => {
      const { data, error } = await supabase.from("transaction").select();

      if (error) return [];
      return data;
    });
    return data.value;
  } finally {
    isLoading.value = false;
  }
};

const refreshTransactions = async () =>
  (transactions.value = await fetchTransactions());

await refreshTransactions();

const transactionsGroupedByDate = computed(() => {
  let grouped = {};

  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split("T")[0];

    grouped[date] ??= [];
    grouped[date].push(transaction);
  }
  return grouped;
});
</script>
