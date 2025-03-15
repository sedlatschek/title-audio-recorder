<template>
  <ModalDialog
    v-model="isOpen"
    confirm-button-text="Save"
    close-button-text="Cancel"
    title="Settings"
    @confirm="onConfirm">
    <form
      class="p-4 text-gray-950 dark:text-gray-200"
      autocomplete="off">
      <label
        for="file-format"
        class="block text-sm font-bold">
        File Format
      </label>
      <select
        id="file-format"
        v-model="mimeTypeSetting"
        class="mt-1 block w-full rounded-md border-1 border-gray-300 px-3 py-2 text-base focus:border-gray-500 focus:ring-amber-500 focus:outline-none dark:focus:border-stone-500">
        <option
          v-for="[mimeType, format] in Object.entries(mimeTypeToExtensionMap)"
          :key="mimeType"
          class="bg-white dark:bg-stone-800"
          :value="mimeType">
          {{ format }}
        </option>
      </select>
    </form>
  </ModalDialog>
  <BtnIcon
    tag="button"
    color="primary"
    title="Settings"
    @click="isOpen = true">
    <IconCog />
  </BtnIcon>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { MimeType, mimeTypeToExtensionMap } from '../../common/MimeType';
import BtnIcon from '../../components/BtnIcon.vue';
import IconCog from '../../components/IconCog.vue';
import ModalDialog from '../../components/ModalDialog.vue';
import { getConfigurationHandler } from '../components/configurationHandler';
import { ConfigurationSettings } from '../configuration/ConfigurationSettings';

const isOpen = ref(false);

const configurationHandler = getConfigurationHandler();

const mimeTypeSetting = ref<MimeType | undefined>(undefined);

async function loadSettings(): Promise<void> {
  const settings = await configurationHandler.getSettings();
  mimeTypeSetting.value = settings.downloadMimeTypes[0];
}

function buildSettings(): ConfigurationSettings {
  if (!mimeTypeSetting.value) {
    throw new Error('Mime type is not set');
  }
  return {
    downloadMimeTypes: [mimeTypeSetting.value],
  };
}

watch(isOpen, async (value) => {
  if (value) {
    await onOpen();
  }
});

function onOpen(): Promise<void> {
  return loadSettings();
}

async function onConfirm(): Promise<void> {
  const settings = buildSettings();
  await configurationHandler.setSettings(settings);
}
</script>
