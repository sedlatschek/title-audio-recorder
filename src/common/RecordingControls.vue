<template>
  <div class="flex justify-end">
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
import { MessageType, StopRecordingMessage } from './Message';
import { RecordingMetadata } from './RecordingMetadata';

const props = defineProps<{
  recording: RecordingMetadata;
}>();

function stop(): void {
  const message: StopRecordingMessage = {
    messageType: MessageType.STOP_RECORDING,
    recording: props.recording,
  };
  console.debug('>> [RecordingControls]', message);
  browser.runtime.sendMessage(message);
}

</script>
