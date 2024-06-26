<script setup>
import { categories, types } from "~/constants";
import { z } from "zod";

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false,
  }
});

const isEditing = computed(() => !!props.transaction);

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};

const state = ref(isEditing.value ? {
  type: props.transaction.type,
  amount: props.transaction.amount,
  created_at: props.transaction.created_at.split('T')[0],
  description: props.transaction.description,
  category: props.transaction.category,
} : { ...initialState });

const isLoading = ref(false);

const isOpen = defineModel();

const supabase = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const emit = defineEmits(["saved"]);

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount needs to be more than 0"),
});

const incomeSchema = z.object({
  type: z.literal("Income"),
});
const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});
const investmentSchema = z.object({
  type: z.literal("Investment"),
});
const savingSchema = z.object({
  type: z.literal("Saving"),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema,
);

const onSubmit = async (event) => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transaction")
      .upsert({
        ...state.value,
        id: props.transaction?.id
      });
    if (!error) {
      toastSuccess({
        title: "Transaction saved",
      });
      isOpen.value = false;
      emit("saved");
      return;
    }
    throw error;
  } catch (e) {
    toastError({
      title: "Transaction not saved",
      description: e.message,
    });
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  Object.assign(state.value, initialState);
};

watch(isOpen, () => {
  if (isOpen.value === false) {
    resetForm();
  }
});
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> {{ isEditing ? 'Edit' : 'Add' }} transaction </template>

      <UForm :state="state" :schema="schema" class="flex flex-col gap-y-4" @submit="onSubmit">
        <UFormGroup label="Transaction type" :required="true" name="type">
          <USelect :disabled="isEditing" placeholder="Pick one..." :options="types" v-model="state.type" />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount">
          <UInput type="number" placeholder="Enter amount..." v-model.number="state.amount" />
        </UFormGroup>

        <UFormGroup label="Transaction date" :required="true" name="created_at">
          <UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
        </UFormGroup>

        <UFormGroup label="Description" hint="Optional" name="description">
          <UInput placeholder="Enter description..." v-model="state.description" />
        </UFormGroup>

        <UFormGroup label="Category" name="category" v-if="state.type === 'Expense'">
          <USelect placeholder="Pick one..." :options="categories" v-model="state.category" />
        </UFormGroup>
        <div>
          <UButton type="submit" color="green" variant="solid" :loading="isLoading">Save</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
