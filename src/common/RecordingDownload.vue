<template>
  <GenericButton
    @click="download"
    :disabled="!recording.stoppedAtTs">
    Download
  </GenericButton>
</template>

<script setup lang="ts">
import browser from "webextension-polyfill";

import { RecordingMetadata } from './RecordingMetadata';
import GenericButton from "../components/GenericButton.vue";
import { MessageType, RecordingDownloadedMessage } from "./Message";

const props = defineProps<{
  recording: RecordingMetadata;
}>();

function download() {
  const message: RecordingDownloadedMessage = {
    messageType: MessageType.RECORDING_DOWNLOADED,
    recording: props.recording,
  }
  browser.runtime.sendMessage(message);
}
</script>
