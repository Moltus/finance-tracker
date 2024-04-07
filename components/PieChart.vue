<script setup>
const colorMode = useColorMode();
const isDarkMode = ref(true);

watch(colorMode, (color) => {
  isDarkMode.value = color.value == "dark";
});

const props = defineProps({
  values: Array,
});

console.log(props.values);

const options = computed(() => ({
  chart: {
    type: "pie",
  },
  title: {
    text: "Repartition",
  },
  tooltip: {
    valueSuffix: "%",
  },
  plotOptions: {
    series: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: [
        {
          enabled: true,
          distance: 20,
        },
        {
          enabled: true,
          distance: -40,
          format: "{point.percentage:.1f}%",
          style: {
            fontSize: "1.2em",
            textOutline: "none",
            opacity: 0.7,
          },
          filter: {
            operator: ">",
            property: "percentage",
            value: 10,
          },
        },
      ],
    },
  },
  series: [
    {
      name: "Percentage",
      colorByPoint: true,
      // data: [
      //   {
      //     name: "Income",
      //     selected: true,
      //     y: 8207.0,
      //   },
      //   {
      //     name: "Expense",
      //     y: 4804.0,
      //   },
      //   {
      //     name: "Saving",
      //     y: 9999.0,
      //   },
      //   {
      //     name: "investment",
      //     y: 0.0,
      //   },
      // ],
      data: props.values,
    },
  ],
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
