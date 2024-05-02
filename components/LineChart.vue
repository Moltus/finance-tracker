<script setup>

const colorMode = useColorMode();
const isDarkMode = ref(true);

watch(colorMode, (color) => {
  isDarkMode.value = color.value == "dark";
});

const props = defineProps({
  selectedView: String,
  data: Object,
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
  optionValues.xAxis.categories = Object.keys(props.data);

  const series = {
    Income: { name: "Income", data: [] },
    Expense: { name: "Expense", data: [] },
    Saving: { name: "Saving", data: [] },
    Investment: { name: "Investment", data: [] },
  };

  for (const key in props.data) {
    const { Income, Expense, Saving, Investment } = props.data[key];
    series.Income.data.push(Income ?? 0);
    series.Expense.data.push(Expense ?? 0);
    series.Saving.data.push(Saving ?? 0);
    series.Investment.data.push(Investment ?? 0);
  }
  optionValues.series = Object.values(series);
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
