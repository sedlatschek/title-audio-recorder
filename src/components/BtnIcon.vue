<template>
  <BaseBtn
    class="h-8 w-8"
    color="primary"
    v-bind="$props">
    <slot />
  </BaseBtn>
</template>

<script setup lang="ts">
import BaseBtn from './BaseBtn.vue';
</script>
