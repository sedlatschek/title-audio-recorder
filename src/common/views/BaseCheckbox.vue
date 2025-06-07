<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="h-5 w-5 rounded-sm border-stone-300 bg-stone-100 accent-amber-600 checked:border-amber-600 checked:bg-amber-600 focus:ring-2 focus:ring-amber-500 dark:border-stone-600 dark:bg-stone-700 dark:accent-amber-600 dark:ring-offset-stone-800 dark:focus:ring-amber-600"
      @input="updateModelValue" />
    <label
      :for="id"
      :class="{ 'opacity-55': disabled }"
      class="ms-1 block text-sm dark:text-white">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  modelValue: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function updateModelValue(event: Event): void {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
}
</script>
