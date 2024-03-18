<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add transaction </template>
      <p>Hello</p>
    </UCard>
  </UModal>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
