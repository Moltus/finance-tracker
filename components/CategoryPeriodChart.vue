<script setup>
const colorMode = useColorMode();
const isDarkMode = ref(true);

watch(colorMode, (color) => {
  isDarkMode.value = color.value == "dark";
});

const props = defineProps({
  selectedView: String,
  values: Array,
});

console.log(props.values);

const options = computed(() => {
  const optionValues = {
    chart: {
      type: "line",
    },
    title: {
      text: `${props.selectedView} transaction totals`,
    },
    xAxis: {
      // categories: [
      //   "Jan",
      //   "Feb",
      //   "Mar",
      //   "Apr",
      //   "May",
      //   "Jun",
      //   "Jul",
      //   "Aug",
      //   "Sep",
      //   "Oct",
      //   "Nov",
      //   "Dec",
      // ],
      categories: [],
    },
    yAxis: {
      title: {
        text: "Amount (€)",
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
      },
    },
    // series: [
    //   {
    //     name: "Current period",
    //     data: [
    //       16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2, 22.0, 17.8,
    //     ],
    //   },
    //   {
    //     name: "Last period",
    //     data: [
    //       -2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5, 2.0, -0.9,
    //     ],
    //   },
    // ],
    series: [],
    chart: {
      backgroundColor: {
        linearGradient: [0, 0, 500, 500],
        stops: [
          [0, "rgb(255, 255, 255)"],
          [1, "rgb(240, 240, 255)"],
        ],
      },
    },
  };
  console.log(props.values);
  optionValues.categories = props.values.map((period) => period.periodName);
  console.log(optionValues.categories);
  const incomeTotal = { name: "Incomes ", data: [] };
  const expenseTotal = { name: "Expenses ", data: [] };
  const savingTotal = { name: "Savings ", data: [] };
  const investmentTotal = { name: "Investments ", data: [] };

  for (let period of props.values) {
    // incomeTotal.data.push(period.income.value);
    // expenseTotal.data.push(period.expense.value);
    // savingTotal.data.push(period.saving.value);
    // investmentTotal.data.push(period.investment.value);
    incomeTotal.data.push(period.transactions.incomeTotal.value);
    expenseTotal.data.push(period.transactions.expenseTotal.value);
    savingTotal.data.push(period.transactions.savingTotal.value);
    investmentTotal.data.push(period.transactions.investmentTotal.value);
  }

  optionValues.series = [
    incomeTotal,
    expenseTotal,
    savingTotal,
    investmentTotal,
  ];

  // const incomeTotals = props.values.map(({ incomeTotal }) => incomeTotal);
  // console.log(incomeTotals);
  // const expenseTotals = props.values.map(({ expenseTotal }) => expenseTotal);
  // const savingTotals = props.values.map(({ savingTotal }) => savingTotal);
  // const investmentTotals = props.values.map(
  //   ({ investmentTotal }) => investmentTotal,
  // );
  // optionValues.series = [
  //   { name: "Income", data: incomeTotals },
  //   { name: "Expense", data: expenseTotals },
  //   { name: "Saving", data: savingTotals },
  //   { name: "Investment", data: investmentTotals },
  // ];

  return optionValues;
});
</script>

<template>
  <div>
    <highchart
      :options="options"
      :class="[isDarkMode ? 'highcharts-dark' : 'highcharts-light']"
    />
  </div>
</template>
