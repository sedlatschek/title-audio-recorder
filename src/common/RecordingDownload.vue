<template>
  <GenericButton
    :disabled="!recording.stoppedAtTs"
    @click="download"
  >
    Download
  </GenericButton>
</template>

<script setup lang="ts">
import browser from 'webextension-polyfill';

import GenericButton from '../components/GenericButton.vue';
import {
 MessageType, RecordingDownloadedMessage, 
} from './Message';
import { RecordingMetadata } from './RecordingMetadata';

const props = defineProps<{
  recording: RecordingMetadata;
}>();

function download(): void {
  const message: RecordingDownloadedMessage = {
    messageType: MessageType.RECORDING_DOWNLOADED,
    recording: props.recording,
  }
  browser.runtime.sendMessage(message);
}
</script>
