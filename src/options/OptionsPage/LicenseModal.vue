<template>
  <ModalDialog
    v-model="isOpen"
    hide-confirm-button
    title="Licenses">
    <p class="mb-3">This extension uses the following third-party libraries:</p>
    <pre class="max-h-128 overflow-y-scroll">{{ license }}</pre>
  </ModalDialog>
  <BtnIcon
    title="Licenses"
    @click="isOpen = true">
    <IconLabel />
  </BtnIcon>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import browser from 'webextension-polyfill';
import BtnIcon from '../../components/BtnIcon.vue';
import IconLabel from '../../components/IconLabel.vue';
import ModalDialog from '../../components/ModalDialog.vue';

const isOpen = ref(false);

const licenseUrl = browser.runtime.getURL('lib/LICENSE.txt');
const license = ref<string | undefined>();

onMounted(async () => {
  license.value = await (await fetch(licenseUrl)).text();
});
</script>
