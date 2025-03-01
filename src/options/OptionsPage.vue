<template>
  <main
    v-if="recordings.length > 0"
    class="p-4">
    <AlertBanner class="mx-auto w-180">
      <template #headline>Warning</template>
      Do not close this tab while recording. Closing the tab will cause all the
      recordings to be lost.
    </AlertBanner>
    <RecordingTable :recordings="recordings" />
  </main>
  <main v-else>
    <div
      class="py-8 text-center text-2xl font-bold text-gray-600 dark:text-gray-400">
      Waiting for you to start recording 👀
    </div>
  </main>
  <footer>
    <p
      class="p-4 text-center text-sm font-extralight text-gray-600 dark:text-gray-400">
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
import { createRecordingsState } from '../common/recordingsState';
import RecordingTable from '../common/RecordingTable.vue';
import AlertBanner from '../components/AlertBanner.vue';

const recordings = createRecordingsState();
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
