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
      :last-amount="prevIncomeTotal"
      :loading="isPending"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotal"
      :last-amount="prevExpenseTotal"
      :loading="isPending"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="5000"
      :loading="isPending"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="3000"
      :loading="isPending"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <p class="text-gray-500 dark:text-gray-400">
        You have
        {{ incomeCount }}
        {{ incomeCount > 1 ? "incomes" : "income" }} and
        {{ expenseCount }}
        {{ expenseCount > 1 ? "expenses" : "expense" }}
        this period
      </p>
    </div>
    <div>
      <TransactionModal v-model="isOpen" @saved="refresh" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <section v-if="!isPending">
    <div v-for="(dayTransactions, date) in byDate" :key="date" class="mb-10">
      <DailyTransactionSummary :date="date" :transactions="dayTransactions" />
      <Transaction
        v-for="transaction in dayTransactions"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refresh"
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

// Modal
const isOpen = ref(false);

const { current, previous } = useSelectedTimePeriod(selectedView);

const {
  isPending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { byDate },
  },
} = useFetchTransactions(current);
await refresh();

const {
  refresh: refreshPrevious,
  transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal,
  },
} = useFetchTransactions(previous);
await refreshPrevious();
</script>
