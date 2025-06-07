<template>
  <ModalDialog
    v-model="isOpen"
    confirm-button-text="Save"
    close-button-text="Cancel"
    title="Settings"
    @confirm="onConfirm">
    <form
      class="flex flex-col gap-5 p-4 text-gray-950 dark:text-gray-200"
      autocomplete="off">
      <div>
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
      </div>
      <div>
        <h3 class="block text-sm font-bold">Downloads</h3>
        <BaseCheckbox
          id="download-automatically"
          v-model="downloadAutomaticallySetting"
          class="mt-1">
          Download recordings automatically after finishing
        </BaseCheckbox>
        <BaseCheckbox
          id="download-automatically-delete"
          v-model="removeAfterDownloadingAutomaticallySetting"
          class="mt-1">
          Delete recordings after downloading automatically
        </BaseCheckbox>
      </div>
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
import { getDefaultConfigurationSettings } from '../../common/configuration/defaultConfigurationSettings';
import { MimeType, mimeTypeToExtensionMap } from '../../common/MimeType';
import BaseCheckbox from '../../common/views/BaseCheckbox.vue';
import BtnIcon from '../../common/views/BtnIcon.vue';
import IconCog from '../../common/views/IconCog.vue';
import ModalDialog from '../../common/views/ModalDialog.vue';
import { getComponents } from '../components';

const isOpen = ref(false);

const { configurationHandler } = getComponents();

const { downloadMimeTypes, downloadAutomatically, removeAfterDownloadingAutomatically } =
  getDefaultConfigurationSettings();

const mimeTypeSetting = ref<MimeType>(downloadMimeTypes[0]);
const downloadAutomaticallySetting = ref<boolean>(downloadAutomatically);
const removeAfterDownloadingAutomaticallySetting = ref<boolean>(
  removeAfterDownloadingAutomatically,
);

async function loadSettings(): Promise<void> {
  mimeTypeSetting.value = (await configurationHandler.get('downloadMimeTypes'))[0];
  downloadAutomaticallySetting.value = await configurationHandler.get('downloadAutomatically');
  removeAfterDownloadingAutomaticallySetting.value = await configurationHandler.get(
    'removeAfterDownloadingAutomatically',
  );
}

async function saveSettings(): Promise<void> {
  await configurationHandler.set('downloadMimeTypes', [mimeTypeSetting.value]);
  await configurationHandler.set('downloadAutomatically', downloadAutomaticallySetting.value);
  await configurationHandler.set(
    'removeAfterDownloadingAutomatically',
    removeAfterDownloadingAutomaticallySetting.value,
  );
}

watch(isOpen, async (value) => {
  if (value) {
    await onOpen();
  }
});

function onOpen(): Promise<void> {
  return loadSettings();
}

function onConfirm(): Promise<void> {
  return saveSettings();
}
</script>
