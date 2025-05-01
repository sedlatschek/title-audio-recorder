<template>
  <component
    :is="tag"
    :class="{
      'from-amber-500 to-yellow-400 text-white hover:from-amber-600 hover:to-yellow-500 focus:ring-amber-300 active:from-amber-700 active:to-yellow-600 disabled:hover:from-amber-500 disabled:hover:to-yellow-400 disabled:active:from-amber-500 disabled:active:to-yellow-400 dark:shadow-amber-900/30 dark:hover:shadow-amber-900/40 dark:focus:ring-amber-500':
        color === 'primary',
      'from-gray-500 to-gray-400 text-white hover:from-gray-600 hover:to-gray-500 focus:ring-gray-300 active:from-gray-700 active:to-gray-600 disabled:hover:from-gray-500 disabled:hover:to-gray-400 disabled:active:from-gray-500 disabled:active:to-gray-400 dark:from-stone-500 dark:to-stone-400 dark:shadow-gray-900/30 dark:hover:from-stone-600 dark:hover:to-stone-500 dark:hover:shadow-gray-900/40 dark:focus:ring-gray-500 dark:focus:ring-stone-300 dark:active:from-stone-700 dark:active:to-stone-600 dark:disabled:hover:from-stone-500 dark:disabled:hover:to-stone-400 dark:disabled:active:from-stone-500 dark:disabled:active:to-stone-400':
        color === 'secondary',
    }"
    class="flex h-8 cursor-pointer items-center justify-center rounded-md bg-gradient-to-r p-2 font-semibold shadow-md transition-all duration-200 hover:shadow-lg focus:ring-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    :type="tag === 'button' ? 'button' : undefined"
    :target="tag === 'a' ? '_blank' : undefined">
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps<{
  color: 'primary' | 'secondary';
  tag: 'button' | 'a';
}>();
</script>
