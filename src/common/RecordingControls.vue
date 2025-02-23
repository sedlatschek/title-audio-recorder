<template>
  <div class="flex justify-between">
    <GenericButton
      :disabled="recording.startedAtTs"
      @click="start"
    >
      Start
    </GenericButton>
    <GenericButton
      :disabled="recording.stoppedAtTs"
      @click="stop"
    >
      Stop
    </GenericButton>
  </div>
</template>

<script setup lang="ts">
import browser from 'webextension-polyfill';

import GenericButton from '../components/GenericButton.vue';
import { MessageType } from './Message';
import { RecordingMetadata } from './RecordingMetadata';

const props = defineProps<{
  recording: RecordingMetadata;
}>();

function start(): void {
  sendMessage(MessageType.RECORDING_STARTED);
}

function stop(): void {
  sendMessage(MessageType.RECORDING_STOPPED);
}

function sendMessage(messageType: MessageType.RECORDING_STARTED | MessageType.RECORDING_STOPPED): void {
  const message = {
    messageType,
    recording: props.recording,
  };
  console.debug('>> [RecordingControls]', message);
  browser.runtime.sendMessage(message);
}
</script>
