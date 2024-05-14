<script setup>
import { transactionViewOptions } from "~/constants";

const selectedView = ref(transactionViewOptions[1]);

// Modal
const isOpen = ref(false);

const { current, previous, history } = useSelectedTimePeriod(selectedView);

const {
  isPending,
  refresh: refreshCurrent,
  transactions: {
    incomeCount: currIncomeCount,
    expenseCount: currExpenseCount,
    savingCount: currSavingCount,
    investmentCount: currInvestmentCount,
    incomeTotal: currIncomeTotal,
    expenseTotal: currExpenseTotal,
    savingTotal: currSavingTotal,
    investmentTotal: currInvestmentTotal,
    grouped: { byDate: currTransactions },
  },
} = useFetchTransactions(current);
refreshCurrent();

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

const {
  refresh: refreshTotals,
  transactions: {
    grouped: { totalsByYear, totalsByMonth, totalsByDay },
  },
} = useFetchTransactions(history);
await refreshTotals();

const pieChartValues = computed(() => [
  { name: "Income", y: currIncomeTotal.value },
  { name: "Expense", y: currExpenseTotal.value },
  { name: "Saving", y: currSavingTotal.value },
  { name: "Investment", y: currInvestmentTotal.value },
]);

const lineChartValues = computed(() => {
  switch (selectedView.value) {
    case "Yearly":
      return totalsByYear.value;
    case "Daily":
      return totalsByDay.value;
    case "Monthly":
    default:
      return totalsByMonth.value;
  }
});

const refreshTransactions = () => {
  refreshCurrent();
  refreshTotals();
};
</script>

<template>
  <section class="flex items-center justify-between mb-5">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <div class="grid grid-cols-1 2xl:grid-cols-2 gap-y-10 2xl:gap-x-16">
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16">
      <Trend color="sky" title="Income" :amount="currIncomeTotal" :last-amount="prevIncomeTotal" :loading="isPending" />
      <Trend color="indigo" title="Expense" :amount="currExpenseTotal" :last-amount="prevExpenseTotal"
        :loading="isPending" />
      <Trend color="green" title="Saving" :amount="currSavingTotal" :last-amount="prevSavingTotal"
        :loading="isPending" />
      <Trend color="orange" title="Investment" :amount="currInvestmentTotal" :last-amount="prevInvestmentTotal"
        :loading="isPending" />
    </section>

    <section class="space-y-10 col-start-1 2xl-col-start-2">
      <!-- <CategoryPeriodChart :selectedView :values="periodHistoryTotals" /> -->
      <PieChart :data="pieChartValues" />
      <LineChart :selected-view :data="lineChartValues" />
    </section>

    <section class="flex justify-between row-start-1 col-start-1 2xl:col-start-2">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <p class="text-gray-500 dark:text-gray-400">
          You have
          {{ currIncomeCount }}
          {{ currIncomeCount > 1 ? "incomes" : "income" }} and
          {{ currExpenseCount }}
          {{ currExpenseCount > 1 ? "expenses" : "expense" }}
          {{ currSavingCount }}
          {{ currSavingCount > 1 ? "savings" : "saving" }} and
          {{ currInvestmentCount }}
          {{ currInvestmentCount > 1 ? "investments" : "investment" }}
          this period
        </p>
      </div>
      <div>
        <TransactionModal v-model="isOpen" @saved="refreshTransactions" />
        <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
      </div>
    </section>

    <section v-if="!isPending" class="transaction-list col-start-1 2xl:col-start-2">
      <div v-for="(dayTransactions, date) in currTransactions" :key="date" class="mb-10">
        <DailyTransactionSummary :date="date" :transactions="dayTransactions" />
        <Transaction v-for="transaction in dayTransactions" :key="transaction.id" :transaction="transaction"
          @deleted="refreshTransactions" @edited="refreshTransactions" />
      </div>
    </section>
    <section v-else class="col-start-1 2xl:col-start-2">
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
  </div>
</template>

<style scoped>
@media (min-width: 1536px) and (min-height: 1180px) {
  .transaction-list {
    min-height: 860px;
    padding-right: 20px;
    max-height: calc(100vh - 340px);
    overflow-y: scroll;
  }
}
</style>
