<template>
  <div class="mx-5 sm:mx-16">
    <AppHeader />
    <main class="my-5">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Link to Google Fonts
useHead({
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
      crossorigin: "",
    },
  ],
});
</script>

<style>
/* Set the font family for the entire site */
body {
  font-family: "Inter";
}

/* Set the background color for the entire site */
body {
  @apply dark:bg-neutral-800 bg-white;
}
</style>
