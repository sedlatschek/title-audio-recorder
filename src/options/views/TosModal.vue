<template>
  <ModalDialog
    v-model="isOpen"
    hide-close-button
    confirm-button-text="Accept Terms of Service"
    disable-backdrop-close
    disable-escape-key-close
    title="Terms of Service"
    @confirm="acceptTos">
    <component :is="LatestTosVersion" />
  </ModalDialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import ModalDialog from '../../common/views/ModalDialog.vue';
import { getComponents } from '../components';

const { tosHandler } = getComponents();
const latestVersion = tosHandler.getLatestTosVersion();
const LatestTosVersion = latestVersion.component;

const isOpen = ref(false);

onBeforeMount(async (): Promise<void> => {
  isOpen.value = !(await tosHandler.isAccepted(latestVersion));
});

function acceptTos(): Promise<void> {
  return tosHandler.accept(latestVersion);
}
</script>
