<template>
  <header
    class="mx-auto flex flex-col-reverse items-center justify-between rounded lg:w-180 lg:flex-row">
    <div class="mt-4 lg:mt-0">
      <AlertBanner v-if="hasRecordings">
        <template #headline>Warning</template>
        Do not close this tab while recording. Closing the tab will cause all the recordings to be
        lost.
      </AlertBanner>
    </div>
    <div class="flex flex-row justify-center gap-2 rounded-b-lg bg-white p-3 dark:bg-stone-700">
      <SettingsModal />
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
    <TransitionGroup name="list">
      <RecordingWidget
        v-for="recording in sortedRecordings"
        :key="recording.id"
        class="mx-auto my-4"
        :message-bus="messageBus"
        padding="lg"
        :recording="recording" />
      <HeartFooter />
    </TransitionGroup>
  </main>
  <main v-else>
    <div class="py-8 text-center text-2xl font-bold text-gray-600 dark:text-stone-300">
      Waiting for you to start recording 👀
    </div>
    <HeartFooter />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createRecordingsRef } from '../../common/recordingsRef';
import RecordingWidget from '../../common/RecordingWidget.vue';
import AlertBanner from '../../components/AlertBanner.vue';
import BtnIcon from '../../components/BtnIcon.vue';
import IconCode from '../../components/IconCode.vue';
import { getMessageBus } from '../components/messageBus';
import SettingsModal from './ConfiguratonModal.vue';
import HeartFooter from './HeartFooter.vue';
import LicenseModal from './LicenseModal.vue';

const messageBus = getMessageBus();
const recordings = createRecordingsRef(messageBus);

const hasRecordings = computed(() => recordings.value.length > 0);
const sortedRecordings = computed(() => {
  const array = Array.from(recordings.value);
  array.sort((a, b) => (b.startedAtTs ?? 0) - (a.startedAtTs ?? 0));
  return array;
});
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

@media (prefers-color-scheme: dark) {
  body {
    background-color: #222020;
    opacity: 1;
    background:
      linear-gradient(135deg, #14131355 25%, transparent 25%) -16px 0/ 32px 32px,
      linear-gradient(225deg, #222020 25%, transparent 25%) -16px 0/ 32px 32px,
      linear-gradient(315deg, #14131355 25%, transparent 25%) 0px 0/ 32px 32px,
      linear-gradient(45deg, #222020 25%, #201f1f 25%) 0px 0/ 32px 32px;
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
