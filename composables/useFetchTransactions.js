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
      const { data } = await useAsyncData(
        `transactions-${period.value.from.toDateString()}-${period.value.from.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from("transaction")
            .select()
            .gte("created_at", period.value.from.toISOString())
            .lte("created_at", period.value.to.toISOString())
            .order("created_at", { ascending: false });

          if (error) return [];
          return data;
        },
      );
      return data.value;
    } finally {
      isPending.value = false;
    }
  };

  const refresh = async () => (transactions.value = await fetchTransactions());

  watch(period, async () => await refresh());

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
