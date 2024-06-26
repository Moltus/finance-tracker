// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "nuxt-highcharts"],
  supabase: {
    redirect: true,
  },
  highcharts: {
    setOptions: {
      credits: false,
      accessibility: { enabled: false },
    },
  },
});
