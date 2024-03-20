<template>
  <UModal v-model="model">
    <UCard>
      <template #header> Add transaction </template>

      <UForm :state="state" :schema="schema" class="flex flex-col gap-y-4">
        <UFormGroup label="Transaction type" :required="true" name="type">
          <USelect
            placeholder="Pick one..."
            :options="types"
            v-model="state.type"
          />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount">
          <UInput
            type="number"
            placeholder="Enter amount..."
            v-model.number="state.amount"
          />
        </UFormGroup>

        <UFormGroup label="Transaction date" :required="true" name="created_at">
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>

        <UFormGroup label="Description" hint="Optional" name="description">
          <UInput
            placeholder="Enter description..."
            v-model="state.description"
          />
        </UFormGroup>

        <UFormGroup
          label="Category"
          name="category"
          v-if="state.type === 'Expense'"
        >
          <USelect
            placeholder="Pick one..."
            :options="categories"
            v-model="state.category"
          />
        </UFormGroup>
      </UForm>

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
import { z } from "zod";

const model = defineModel();

const state = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

const schema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount needs to be more than 0"),
});
</script>
