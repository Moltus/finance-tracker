import {
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
  format,
} from "date-fns";

// export const useSelectedTimePeriod = (period) => {
//   const current = computed(() => {
//     switch (period.value) {
//       case "Yearly":
//         return {
//           from: startOfYear(new Date()),
//           to: endOfYear(new Date()),
//         };
//       case "Monthly":
//         return {
//           from: startOfMonth(new Date()),
//           to: endOfMonth(new Date()),
//         };
//       case "Daily":
//         return {
//           from: startOfDay(new Date()),
//           to: endOfDay(new Date()),
//         };
//     }
//   });
//
//   const previous = computed(() => {
//     switch (period.value) {
//       case "Yearly":
//         return {
//           from: startOfYear(subYears(new Date(), 1)),
//           to: endOfYear(subYears(new Date(), 1)),
//         };
//       case "Monthly":
//         return {
//           from: startOfMonth(subMonths(new Date(), 1)),
//           to: endOfMonth(subMonths(new Date(), 1)),
//         };
//       case "Daily":
//         return {
//           from: startOfDay(subDays(new Date(), 1)),
//           to: endOfDay(subDays(new Date(), 1)),
//         };
//     }
//   });
//
//   return { current, previous };
// };

// export const useSelectedTimePeriod = (period) => {
//   const values = computed(() => {
//     if (period.value == "Yearly") {
//       const years = [];
//       for (let i = 0; i < 5; i++) {
//         years.push({
//           name: format(new Date(), "YYYY"),
//           from: startOfYear(subYears(new Date(), i)),
//           to: endOfYear(subYears(new Date(), i)),
//         });
//       }
//       return years;
//     } else if (period.value == "Monthly") {
//       const months = [];
//       for (let i = 0; i < 12; i++) {
//         months.push({
//           name: format(new Date(), "LLL"),
//           from: startOfMonth(subMonths(new Date(), i)),
//           to: endOfMonth(subMonths(new Date(), i)),
//         });
//       }
//       return months;
//     } else if (period.value == "Daily") {
//       const days = [];
//       for (let i = 0; i < 7; i++) {
//         days.push({
//           name: format(new Date(), "LLL"),
//           from: startOfDay(subDays(new Date(), i)),
//           to: endOfDay(subDays(new Date(), i)),
//         });
//       }
//       return days;
//     }
//   });
//   return values;
// };

export const useSelectedTimePeriod = (period) => {
  const periodValues = computed(() => {
    const values = [];
    if (period.value == "Yearly") {
      for (let i = 4; i >= 0; i--) {
        values.push({
          name: format(subYears(new Date(), i), "yyyy"),
          from: startOfYear(subYears(new Date(), i)),
          to: endOfYear(subYears(new Date(), i)),
        });
      }
    } else if (period.value == "Monthly") {
      for (let i = 11; i >= 0; i--) {
        values.push({
          name: format(subMonths(new Date(), i), "LLL"),
          from: startOfMonth(subMonths(new Date(), i)),
          to: endOfMonth(subMonths(new Date(), i)),
        });
      }
    } else if (period.value == "Daily") {
      for (let i = 6; i >= 0; i--) {
        values.push({
          name: format(subDays(new Date(), i), "EEE"),
          from: startOfDay(subDays(new Date(), i)),
          to: endOfDay(subDays(new Date(), i)),
        });
      }
    }
    return values;
  });
  return periodValues;
};
