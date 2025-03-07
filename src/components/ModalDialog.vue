<template>
  <transition
    name="fade"
    appear>
    <div
      v-if="modelValue"
      key="modal"
      class="fixed inset-0 z-20 flex items-center justify-center">
      <div
        class="fixed inset-0 bg-black opacity-50"
        @click="close" />
      <div class="z-30 w-11/12 overflow-hidden rounded-lg bg-white shadow-lg lg:w-1/2 xl:w-1/3">
        <div class="p-4">
          <h3 class="text-lg font-bold">{{ title }}</h3>
        </div>
        <div class="p-4">
          <slot />
        </div>
        <div
          v-if="!hideCloseButton || !hideConfirmButton"
          class="flex justify-end space-x-2 p-4">
          <BtnText
            v-if="!hideCloseButton"
            color="secondary"
            @click="close">
            {{ closeButtonText }}
          </BtnText>
          <BtnText
            v-if="!hideConfirmButton"
            color="primary"
            @click="confirm">
            {{ confirmButtonText }}
          </BtnText>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import BtnText from './BtnText.vue';

const {
  title,
  modelValue,
  hideCloseButton,
  closeButtonText = 'Close',
  hideConfirmButton,
  confirmButtonText = 'Confirm',
} = defineProps<{
  title: string;
  modelValue: boolean;
  hideCloseButton?: boolean;
  closeButtonText?: string;
  hideConfirmButton?: boolean;
  confirmButtonText?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

const close = (): void => {
  emit('close');
  emit('update:modelValue', false);
};

const confirm = (): void => {
  emit('confirm');
  emit('update:modelValue', false);
};
</script>

<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
