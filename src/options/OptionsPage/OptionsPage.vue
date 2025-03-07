<template>
  <header class="mx-auto flex w-180 flex-row items-center justify-between rounded py-1">
    <div>
      <AlertBanner v-if="hasRecordings">
        <template #headline>Warning</template>
        Do not close this tab while recording. Closing the tab will cause all the recordings to be
        lost.
      </AlertBanner>
    </div>
    <div class="flex flex-row justify-center gap-2 rounded-b-lg bg-white p-3">
      <LicenseModal />
      <BtnIcon
        tag="a"
        title="Source Code"
        alt="Source Code"
        href="https://github.com/sedlatschek/title-audio-recorder">
        <IconCode />
      </BtnIcon>
    </div>
  </header>
  <main v-if="hasRecordings">
    <RecordingWidget
      v-for="recording in recordings"
      :key="recording.id"
      class="mx-auto my-4"
      :message-bus="messageBus"
      padding="lg"
      :recording="recording" />
  </main>
  <main v-else>
    <div class="py-8 text-center text-2xl font-bold text-gray-600 dark:text-gray-400">
      Waiting for you to start recording 👀
    </div>
  </main>
  <footer>
    <p class="p-4 text-center text-sm font-extralight text-gray-600 dark:text-gray-400">
      Made with ❤️ by
      <a
        target="_blank"
        href="https://github.com/sedlatschek">
        Simon Sedlatschek
      </a>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createRecordingsRef } from '../../common/recordingsRef';
import RecordingWidget from '../../common/RecordingWidget.vue';
import AlertBanner from '../../components/AlertBanner.vue';
import BtnIcon from '../../components/BtnIcon.vue';
import IconCode from '../../components/IconCode.vue';
import { getMessageBus } from '../components/messageBus';
import LicenseModal from './LicenseModal.vue';

const messageBus = getMessageBus();
const recordings = createRecordingsRef(messageBus);

const hasRecordings = computed(() => recordings.value.length > 0);
</script>

<style lang="css">
body {
  background-color: #f4f4f4;
  opacity: 1;
  background:
    linear-gradient(135deg, #ffffff55 25%, transparent 25%) -16px 0/ 32px 32px,
    linear-gradient(225deg, #ffffff 25%, transparent 25%) -16px 0/ 32px 32px,
    linear-gradient(315deg, #ffffff55 25%, transparent 25%) 0px 0/ 32px 32px,
    linear-gradient(45deg, #ffffff 25%, #f4f4f4 25%) 0px 0/ 32px 32px;
}
</style>
