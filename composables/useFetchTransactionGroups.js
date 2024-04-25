export const useFetchTransactionGroups = (periodHistory) => {
  const transactionGroups = ref({});
  const isPending = ref(false);

  // backend querying
  const supabase = useSupabaseClient();

  // watch(transactionGroups, () => {
  //   for (let group in transactionGroups.value) {
  //     console.log(transactionGroups.value[group]);
  //   }
  // });

  const groupTotals = computed(() => {
    const returnValues = {};
    for (let group in transactionGroups.value) {
      returnValues[group] = {};
      // console.log(transactionGroups.value[group]);
      // console.log(group);
      const incomes = transactionGroups.value[group].filter(
        (t) => t.type === "Income",
      );
      console.log(incomes);
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
  // const income = computed(() =>
  //   transactions.value.filter((t) => t.type === "Income"),
  // );
  //
  // const expense = computed(() =>
  //   transactions.value.filter((t) => t.type === "Expense"),
  // );
  //
  // const saving = computed(() =>
  //   transactions.value.filter((t) => t.type === "Saving"),
  // );
  //
  // const investment = computed(() =>
  //   transactions.value.filter((t) => t.type === "Investment"),
  // );
  //
  // const incomeCount = computed(() => income.value.length);
  // const expenseCount = computed(() => expense.value.length);
  // const savingCount = computed(() => saving.value.length);
  // const investmentCount = computed(() => investment.value.length);
  //
  // const incomeTotal = computed(() =>
  //   income.value.reduce((acc, curr) => acc + curr.amount, 0),
  // );
  //
  // const expenseTotal = computed(() =>
  //   expense.value.reduce((acc, curr) => acc + curr.amount, 0),
  // );
  //
  // const savingTotal = computed(() =>
  //   saving.value.reduce((acc, curr) => acc + curr.amount, 0),
  // );
  //
  // const investmentTotal = computed(() =>
  //   investment.value.reduce((acc, curr) => acc + curr.amount, 0),
  // );

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
        // console.log(data.value);
        dataGroup[period.name] = data.value;
        // console.log(dataGroup);
      }
      // for (let group in dataGroup) {
      //   console.log(group);
      //   const incomes = dataGroup[group].transactions.filter(
      //     (t) => t.type === "Income",
      //   );
      //   dataGroup[group].incomeTotal = incomes.reduce(
      //     (acc, curr) => acc + curr.amount,
      //     0,
      //   );
      //   const expenses = dataGroup[group].transactions.filter(
      //     (t) => t.type === "Expense",
      //   );
      //   dataGroup[group].expenseTotal = expenses.reduce(
      //     (acc, curr) => acc + curr.amount,
      //     0,
      //   );
      //   const savings = dataGroup[group].transactions.filter(
      //     (t) => t.type === "Saving",
      //   );
      //   dataGroup[group].savingTotal = savings.reduce(
      //     (acc, curr) => acc + curr.amount,
      //     0,
      //   );
      //   const investments = dataGroup[group].transactions.filter(
      //     (t) => t.type === "Investment",
      //   );
      //   dataGroup[group].investmentTotal = investments.reduce(
      //     (acc, curr) => acc + curr.amount,
      //     0,
      //   );
      // }
      return dataGroup;
    } finally {
      isPending.value = false;
    }
  };

  const refresh = async () =>
    (transactionGroups.value = await fetchTransactions());

  watch(periodHistory, async () => {
    // console.log(periodHistory);
    await refresh();
  });

  // const transactionsGroupedByDate = computed(() => {
  //   let grouped = {};
  //
  //   for (const transaction of transactions.value) {
  //     const date = new Date(transaction.created_at)
  //       .toISOString()
  //       .split("T")[0];
  //
  //     grouped[date] ??= [];
  //     grouped[date].push(transaction);
  //   }
  //   return grouped;
  // });

  // console.log(transactionGroups.value);
  return { transactionGroups, refresh, groupTotals };
};
