<template>
  <BaseBtn
    class="px-3"
    v-bind="$props">
    <slot />
  </BaseBtn>
</template>

<script setup lang="ts">
import BaseBtn from './BaseBtn.vue';

defineProps<{
  color: 'primary' | 'secondary';
}>();
</script>
