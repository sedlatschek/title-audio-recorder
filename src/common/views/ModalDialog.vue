<template>
  <transition
    name="fade"
    appear>
    <div
      v-if="modelValue"
      key="modal"
      class="fixed inset-0 z-20 flex items-center justify-center text-gray-950 dark:text-gray-200">
      <div
        class="fixed inset-0 bg-black opacity-50 dark:bg-stone-900"
        @click="onBackdropClick" />
      <div
        class="z-30 w-11/12 overflow-hidden rounded-lg bg-white shadow-lg lg:w-1/2 xl:w-1/3 dark:bg-stone-700">
        <div class="px-6 py-4">
          <h2 class="text-2xl font-medium">{{ title }}</h2>
        </div>
        <div class="p-4">
          <slot />
        </div>
        <div
          v-if="!hideCloseButton || !hideConfirmButton"
          class="flex justify-end space-x-2 p-4">
          <BtnText
            v-if="!hideCloseButton"
            tag="button"
            color="secondary"
            @click="close">
            {{ closeButtonText }}
          </BtnText>
          <BtnText
            v-if="!hideConfirmButton"
            tag="button"
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
import { onBeforeUnmount, onMounted } from 'vue';
import BtnText from './BtnText.vue';

const {
  title,
  modelValue,
  hideCloseButton,
  closeButtonText = 'Close',
  hideConfirmButton,
  confirmButtonText = 'Confirm',
  disableBackdropClose,
  disableEscapeKeyClose,
} = defineProps<{
  title: string;
  modelValue: boolean;
  hideCloseButton?: boolean;
  closeButtonText?: string;
  hideConfirmButton?: boolean;
  confirmButtonText?: string;
  disableBackdropClose?: boolean;
  disableEscapeKeyClose?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

function confirm(): void {
  emit('confirm');
  emit('update:modelValue', false);
}

function close(): void {
  emit('close');
  emit('update:modelValue', false);
}

function onBackdropClick(): void {
  if (!disableBackdropClose) {
    close();
  }
}

function onKeyup(event: KeyboardEvent): void {
  if (!modelValue) {
    return;
  }

  if (event.key === 'Escape' && !disableEscapeKeyClose) {
    close();
  }
}

onMounted(() => {
  window.addEventListener('keyup', onKeyup);
});

onBeforeUnmount(() => {
  window.removeEventListener('keyup', onKeyup);
});
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
