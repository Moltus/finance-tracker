import { getMonth, getYear, format, eachDayOfInterval, eachMonthOfInterval, eachYearOfInterval } from "date-fns";
import { types } from "~/constants";

export const useFetchTransactions = (period) => {
  const transactions = ref([]);
  const isPending = ref(false);

  // backend querying
  const supabase = useSupabaseClient();

  const income = computed(() =>
    transactions.value.filter((t) => t.type === "Income"),
  );

  const expense = computed(() =>
    transactions.value.filter((t) => t.type === "Expense"),
  );

  const saving = computed(() =>
    transactions.value.filter((t) => t.type === "Saving"),
  );

  const investment = computed(() =>
    transactions.value.filter((t) => t.type === "Investment"),
  );

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);
  const savingCount = computed(() => saving.value.length);
  const investmentCount = computed(() => investment.value.length);

  const incomeTotal = computed(() =>
    income.value.reduce((acc, curr) => acc + curr.amount, 0),
  );

  const expenseTotal = computed(() =>
    expense.value.reduce((acc, curr) => acc + curr.amount, 0),
  );

  const savingTotal = computed(() =>
    saving.value.reduce((acc, curr) => acc + curr.amount, 0),
  );

  const investmentTotal = computed(() =>
    investment.value.reduce((acc, curr) => acc + curr.amount, 0),
  );

  const fetchTransactions = async () => {
    isPending.value = true;
    try {
      // const { data } = await useAsyncData(
      //   `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
      //   async () => {
      //     const { data, error } = await supabase
      //       .from("transaction")
      //       .select()
      //       .gte("created_at", period.value.from.toISOString())
      //       .lte("created_at", period.value.to.toISOString())
      //       .order("created_at", { ascending: false });
      //
      //     if (error) return [];
      //     return data;
      //   },
      // );
      const { data, error } = await supabase
        .from("transaction")
        .select()
        .gte("created_at", period.value.from.toISOString())
        .lte("created_at", period.value.to.toISOString())
        .order("created_at", { ascending: false });

      if (error) return [];
      return data;
    } finally {
      isPending.value = false;
    }
  };

  const refresh = async () => (transactions.value = await fetchTransactions());

  watch(period, async () => await refresh());

  const getTransactionTotalsBy = (segmentIntervalFn, dateFormat) => {
    const interval = { start: period.value.from, end: period.value.to };
    const segments = segmentIntervalFn(interval).map((date) => format(date, dateFormat));

    const totals = segments.reduce((acc, key) => {
      acc[key] = {};
      for (const type of types) {
        acc[key][type] = 0;
      }
      return acc;
    }, {});

    for (const transaction of transactions.value) {
      const segment = format(new Date(transaction.created_at), dateFormat);
      if (!totals[segment]) {
        continue;
      }
      totals[segment][transaction.type] += transaction.amount;
    }

    return totals;
  }

  const transactionsTotalsByYear = computed(() => {
    return getTransactionTotalsBy(eachYearOfInterval, 'yyyy');
  });

  const transactionsTotalsByMonth = computed(() => {
    return getTransactionTotalsBy(eachMonthOfInterval, 'LLL');
  });

  const transactionsTotalsByDay = computed(() => {
    return getTransactionTotalsBy(eachDayOfInterval, 'MM/dd');
  });

  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      const date = new Date(transaction.created_at).toISOString().split("T")[0];

      grouped[date] ??= [];
      grouped[date].push(transaction);
    }
    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        totalsByYear: transactionsTotalsByYear,
        totalsByMonth: transactionsTotalsByMonth,
        totalsByDay: transactionsTotalsByDay,
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      saving,
      investment,
      incomeCount,
      expenseCount,
      savingCount,
      investmentCount,
      incomeTotal,
      expenseTotal,
      savingTotal,
      investmentTotal,
    },
    refresh,
    isPending,
  };
};
