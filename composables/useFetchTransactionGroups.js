export const useFetchTransactionGroups = (periodHistory) => {
  const transactionGroups = ref({});
  const isPending = ref(false);

  // backend querying
  const supabase = useSupabaseClient();

  const groupTotals = computed(() => {
    const returnValues = {};
    for (let group in transactionGroups.value) {
      returnValues[group] = {};
      const incomes = transactionGroups.value[group].filter(
        (t) => t.type === "Income",
      );
      returnValues[group].incomeTotal = incomes.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );
      const expenses = transactionGroups.value[group].filter(
        (t) => t.type === "Expense",
      );
      returnValues[group].expenseTotal = expenses.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );
      const savings = transactionGroups.value[group].filter(
        (t) => t.type === "Saving",
      );
      returnValues[group].savingTotal = savings.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );
      const investments = transactionGroups.value[group].filter(
        (t) => t.type === "Investment",
      );
      returnValues[group].investmentTotal = investments.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );
    }
    return returnValues;
  });

  const fetchTransactions = async () => {
    isPending.value = true;
    try {
      const dataGroup = {};
      for (let period of periodHistory.value) {
        const { data } = await useAsyncData(
          `transactions-${period.from.toDateString()}-${period.to.toDateString()}`,
          async () => {
            const { data, error } = await supabase
              .from("transaction")
              .select()
              .gte("created_at", period.from.toISOString())
              .lte("created_at", period.to.toISOString())
              .order("created_at", { ascending: false });

            if (error) return [];
            return data;
          },
        );
        dataGroup[period.name] = data.value;
      }
      return dataGroup;
    } finally {
      isPending.value = false;
    }
  };

  const refresh = async () =>
    (transactionGroups.value = await fetchTransactions());

  watch(periodHistory, async () => {
    await refresh();
  });

  return { transactionGroups, refresh, groupTotals };
};
