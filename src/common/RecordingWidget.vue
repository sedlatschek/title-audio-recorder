<template>
  <div
    class="max-w-196 rounded-3xl bg-black/5 p-2 outline outline-white/15 backdrop-blur-md dark:bg-white/10">
    <div
      :class="{
        barberpole: !props.recording.stoppedAtTs,
        'bg-white dark:bg-gray-950': props.recording.stoppedAtTs,
      }"
      class="relative rounded-2xl p-1 outline outline-black/5">
      <div
        :class="{
          'p-6': props.padding === 'lg',
          'p-4': props.padding === 'sm',
        }"
        class="flex w-full flex-row items-center gap-6 rounded-2xl bg-white dark:bg-gray-950">
        <RecordingImage :recording="recording" />
        <div class="items-left flex flex-col">
          <span class="mb-2 text-2xl leading-none font-medium text-gray-950 dark:text-white">
            {{ recording.title }}
          </span>
          <div>
            <a
              target="_blank"
              class="leading-none font-medium break-all text-sky-500 dark:text-white"
              :href="recording.pageUrl">
              {{ recording.pageUrl }}
            </a>
          </div>
          <span class="flex gap-2 font-medium text-gray-600 dark:text-gray-400">
            <DateText
              v-if="recording.startedAtTs"
              :timestamp="recording.startedAtTs" />
            ·
            <DurationText
              v-if="recording.startedAtTs"
              :started-at-ts="recording.startedAtTs"
              :stopped-at-ts="recording.stoppedAtTs" />
          </span>
        </div>
        <div class="flex grow flex-row justify-end">
          <div class="flex flex-col gap-1">
            <BtnIcon
              title="Stop recording"
              :disabled="recording.stoppedAtTs"
              @click="stop">
              <IconRectangle />
            </BtnIcon>
            <BtnIcon
              title="Download recording"
              :disabled="!recordingDownload"
              @click="download">
              <IconArrowDown />
            </BtnIcon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import browser from 'webextension-polyfill';
import BtnIcon from '../components/BtnIcon.vue';
import DateText from '../components/DateText.vue';
import DurationText from '../components/DurationText.vue';
import IconArrowDown from '../components/IconArrowDown.vue';
import IconRectangle from '../components/IconRectangle.vue';
import { MessageBus } from './MessageBus';
import RecordingImage from './RecordingImage.vue';
import { RecordingDownload, RecordingMetadata } from './RecordingMetadata';

const props = defineProps<{
  messageBus: MessageBus;
  padding: 'sm' | 'lg';
  recording: RecordingMetadata;
}>();

function stop(): Promise<void> {
  return props.messageBus.stopRecording(props.recording);
}

const recordingDownload = computed<RecordingDownload | undefined>(
  () => props.recording.downloads[0],
);

function download(): Promise<number> {
  if (!recordingDownload.value) {
    throw new Error('No download available');
  }
  return browser.downloads.download({
    url: recordingDownload.value.url,
    filename: `${props.recording.title}.${recordingDownload.value.extension}`,
  });
}
</script>

<style>
.barberpole {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 1rem,
    #ccc 1rem,
    #ccc 2rem
  );
  background-size: 200% 200%;
  animation: barberpole 10s linear infinite;
}

@keyframes barberpole {
  100% {
    background-position: 100% 100%;
  }
}
</style>
