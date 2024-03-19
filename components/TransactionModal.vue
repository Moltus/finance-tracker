<template>
  <UModal v-model="model">
    <UCard>
      <template #header> Add transaction </template>

      <div class="flex flex-col gap-y-4">
        <UFormGroup label="Transaction type" :required="true" name="type">
          <USelect placeholder="Pick one..." :options="types" v-model="type" />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount">
          <UInput type="number" placeholder="Enter amount..." />
        </UFormGroup>

        <UFormGroup label="Transaction date" :required="true" name="created_at">
          <UInput type="date" icon="i-heroicons-calendar-days-20-solid" />
        </UFormGroup>

        <UFormGroup label="Description" hint="Optional" name="description">
          <UInput placeholder="Enter description..." />
        </UFormGroup>

        <UFormGroup label="Category" name="category">
          <USelect
            placeholder="Pick one..."
            :options="categories"
            v-model="category"
          />
        </UFormGroup>
      </div>

      <div class="mt-4">
        <UButton
          type="submit"
          color="blue"
          variant="solid"
          label="Save"
          @click="model = false"
        />
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { categories, types } from "~/constants";
const model = defineModel();

const category = ref(null);
const type = ref(null);
</script>
