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

const options = computed(() => {
  const optionValues = {
    chart: {
      type: "line",
    },
    title: {
      text: `${props.selectedView} transaction totals`,
    },
    xAxis: {
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
  optionValues.categories = props.values.map((period) => period.periodName);
  const incomeTotal = { name: "Incomes ", data: [] };
  const expenseTotal = { name: "Expenses ", data: [] };
  const savingTotal = { name: "Savings ", data: [] };
  const investmentTotal = { name: "Investments ", data: [] };

  for (let period of props.values) {
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
