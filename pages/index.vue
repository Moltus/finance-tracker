<script setup>
import { transactionViewOptions } from "~/constants";

const selectedView = ref(transactionViewOptions[1]);

// Modal
const isOpen = ref(false);

const { current, previous } = useSelectedTimePeriod(selectedView);
console.log(selectedView);
console.log(current.value, previous.value);

const {
  isPending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    savingCount,
    investmentCount,
    incomeTotal,
    expenseTotal,
    savingTotal,
    investmentTotal,
    grouped: { byDate },
  },
} = useFetchTransactions(current);
refresh();

const {
  refresh: refreshPrevious,
  transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal,
    savingTotal: prevSavingTotal,
    investmentTotal: prevInvestmentTotal,
  },
} = useFetchTransactions(previous);
refreshPrevious();

const pieChartValues = computed(() => [
  { name: "Income", y: incomeTotal.value },
  { name: "Expense", y: expenseTotal.value },
  { name: "Saving", y: savingTotal.value },
  { name: "Investment", y: investmentTotal.value },
]);
</script>

<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <div class="grid grid-cols-1 2xl:grid-cols-2 gap-y-10 2xl:gap-x-16">
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16">
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
        title="Saving"
        :amount="savingTotal"
        :last-amount="prevSavingTotal"
        :loading="isPending"
      />
      <Trend
        color="red"
        title="Investment"
        :amount="investmentTotal"
        :last-amount="prevInvestmentTotal"
        :loading="isPending"
      />
    </section>

    <section class="space-y-16 pt-5 col-start-1 2xl-col-start-2">
      <LineChart />
      <PieChart :values="pieChartValues" />
    </section>

    <section
      class="flex justify-between row-start-1 col-start-1 2xl:col-start-2"
    >
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <p class="text-gray-500 dark:text-gray-400">
          You have
          {{ incomeCount }}
          {{ incomeCount > 1 ? "incomes" : "income" }} and
          {{ expenseCount }}
          {{ expenseCount > 1 ? "expenses" : "expense" }}
          {{ savingCount }}
          {{ savingCount > 1 ? "savings" : "saving" }} and
          {{ investmentCount }}
          {{ investmentCount > 1 ? "investments" : "investment" }}
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

    <section v-if="!isPending" class="col-start-1 2xl:col-start-2">
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
    <section v-else class="col-start-1 2xl:col-start-2">
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
  </div>
</template>
