<template>
  <UModal v-model="model">
    <UCard>
      <template #header> Add transaction </template>
      <p>Hello</p>
    </UCard>
  </UModal>
</template>

<script setup>
const model = defineModel();
</script>
