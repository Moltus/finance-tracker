<script setup>
const colorMode = useColorMode();
const isDarkMode = ref(true);

watch(colorMode, (color) => {
  isDarkMode.value = color.value == "dark";
});

const options = computed(() => ({
  chart: {
    type: "line",
  },
  title: {
    text: "Monthly Average Temperature",
  },
  xAxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  yAxis: {
    title: {
      text: "Temperature (°C)",
    },
  },
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true,
      },
      enableMouseTracking: false,
    },
  },
  series: [
    {
      name: "Reggane",
      data: [
        16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2, 22.0, 17.8,
      ],
    },
    {
      name: "Tallinn",
      data: [
        -2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5, 2.0, -0.9,
      ],
    },
  ],
  chart: {
    backgroundColor: {
      linearGradient: [0, 0, 500, 500],
      stops: [
        [0, "rgb(255, 255, 255)"],
        [1, "rgb(240, 240, 255)"],
      ],
    },
  },
}));
</script>

<template>
  <div>
    <highchart
      :options="options"
      :class="[isDarkMode ? 'highcharts-dark' : 'highcharts-light']"
    />
  </div>
</template>
