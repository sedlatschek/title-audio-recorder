<template>
  <div
    class="rounded-3xl bg-black/5 p-2 outline outline-white/15 backdrop-blur-md dark:bg-white/10 max-w-196"
  >
    <div class="relative flex w-full flex-row rounded-2xl bg-white outline outline-black/5 dark:bg-gray-950 p-7 gap-6 items-center">
      <RecordingImage :recording="recording" />
      <div class="flex flex-col items-left">
        <span class="text-gray-950 dark:text-white text-2xl font-medium">{{ recording.title }}</span>
        <div>
          <a
            target="_blank"
            class="text-sky-500 dark:text-white font-medium"
            :href="recording.url"
          >
            {{ recording.url }}
          </a>
        </div>
        <span class="text-gray-600 dark:text-gray-400 flex gap-2 font-medium">
          <DateText
            v-if="recording.startedAtTs"
            :timestamp="recording.startedAtTs"
          />
          ·
          <DurationText
            v-if="recording.startedAtTs"
            :started-at-ts="recording.startedAtTs"
            :stopped-at-ts="recording.stoppedAtTs"
          />
        </span>
      </div>
      <div class="grow flex flex-row justify-end">
        <div class="flex flex-col gap-1">
          <BtnIcon
            title="Stop recording"
            :disabled="recording.stoppedAtTs"
            @click="stop"
          >
            <IconStop />
          </BtnIcon>
          <BtnIcon
            title="Download recording"
            :disabled="!recording.stoppedAtTs"
            @click="download"
          >
            <IconDownload />
          </BtnIcon>
        </div>
      </div>
      <div class="bg " />
    </div>
  </div>
</template>

<script setup lang="ts">
import browser from 'webextension-polyfill';
import BtnIcon from '../components/BtnIcon.vue';
import DateText from '../components/DateText.vue';
import DurationText from '../components/DurationText.vue';
import IconDownload from '../components/IconDownload.vue';
import IconStop from '../components/IconStop.vue';
import { MessageType, RecordingDownloadedMessage, StopRecordingMessage } from './Message';
import RecordingImage from './RecordingImage.vue';
import { RecordingMetadata } from './RecordingMetadata';

const props = defineProps<{
  recording: RecordingMetadata;
}>();

function download(): void {
  const message: RecordingDownloadedMessage = {
    messageType: MessageType.RECORDING_DOWNLOADED,
    recording: props.recording,
  };
  console.debug('>> [RecordingWidget]', message);
  browser.runtime.sendMessage(message);
}

function stop(): void {
  const message: StopRecordingMessage = {
    messageType: MessageType.STOP_RECORDING,
    recording: props.recording,
  };
  console.debug('>> [RecordingWidget]', message);
  browser.runtime.sendMessage(message);
}
</script>
