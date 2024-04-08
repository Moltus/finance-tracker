<script setup>
import { transactionViewOptions } from "~/constants";

const selectedView = ref(transactionViewOptions[1]);

// Modal
const isOpen = ref(false);
// let periodHistory = ref([]);

// const { current, previous } = useSelectedTimePeriod(selectedView);
// const periodHistory = useSelectedTimePeriod(selectedView);
const periodHistory = useSelectedTimePeriod(selectedView);

console.log(periodHistory.value);
const current = computed(
  () => periodHistory.value[periodHistory.value.length - 1],
);
const previous = computed(
  () => periodHistory.value[periodHistory.value.length - 2],
);
// const current = reactive(periodHistory.value[periodHistory.value.length - 1]);
// const previous = reactive(periodHistory.value[periodHistory.value.length - 2]);
// console.log(current.value);
// console.log(previous.value);

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
    grouped: { byDate },
  },
} = useFetchTransactions(current);
// } = useFetchTransactions(periodHistory.value[periodHistory.value.length - 1]);
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
// // } = useFetchTransactions(periodHistory.value[periodHistory.value.length - 2]);
refreshPrevious();

// const periodHistoryTotals = computed(() => {
//   const values = [];
//   for (let period of periodHistory.value) {
//     console.log(period);
//     let {
//       refresh,
//       // transactions: { incomeTotal, expenseTotal, savingTotal, investmentTotal },
//       transactions,
//     } = useFetchTransactions(period);
//     refresh();
//     values.push({
//       periodName: period.name,
//       // totals: {
//       //   incomeTotal: incomeTotal.value,
//       //   expenseTotal: expenseTotal.value,
//       //   savingTotal: savingTotal.value,
//       //   investmentTotal: investmentTotal.value,
//       // },
//
//       transactions,
//
//       // income: incomeTotal.value,
//       // expense: expenseTotal.value,
//       // saving: savingTotal.value,
//       // investment: investmentTotal.value,
//     });
//   }
//   return values;
// });
// console.log(periodHistoryTotals.value);

const {
  transactionGroups,
  refresh: refreshTotals,
  groupTotals,
} = useFetchTransactionGroups(periodHistory);
refreshTotals();

computed(() => {
  for (let group in groupTotals.value) {
    console.log(group);
  }
});
console.log(transactionGroups.value);
console.log(groupTotals.value);

const pieChartValues = computed(() => [
  { name: "Income", y: currIncomeTotal.value },
  { name: "Expense", y: currExpenseTotal.value },
  { name: "Saving", y: currSavingTotal.value },
  { name: "Investment", y: currInvestmentTotal.value },
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
        :amount="currIncomeTotal"
        :last-amount="prevIncomeTotal"
        :loading="isPending"
      />
      <Trend
        color="red"
        title="Expense"
        :amount="currExpenseTotal"
        :last-amount="prevExpenseTotal"
        :loading="isPending"
      />
      <Trend
        color="green"
        title="Saving"
        :amount="currSavingTotal"
        :last-amount="prevSavingTotal"
        :loading="isPending"
      />
      <Trend
        color="red"
        title="Investment"
        :amount="currInvestmentTotal"
        :last-amount="prevInvestmentTotal"
        :loading="isPending"
      />
    </section>

    <section class="space-y-16 pt-5 col-start-1 2xl-col-start-2">
      <!-- <CategoryPeriodChart :selectedView :values="periodHistoryTotals" /> -->
      <LineChart :selected-view />
      <PieChart :values="pieChartValues" />
    </section>

    <section
      class="flex justify-between row-start-1 col-start-1 2xl:col-start-2"
    >
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
        <TransactionModal v-model="isOpen" @saved="refreshCurrent" />
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
          @deleted="refreshCurrent"
        />
      </div>
    </section>
    <section v-else class="col-start-1 2xl:col-start-2">
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
  </div>
</template>
