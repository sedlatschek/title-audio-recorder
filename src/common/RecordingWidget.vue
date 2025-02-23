<template>
  <div class="flex flex-col max-w-72 border-2 rounded p-2">
    <div class="text-xs font-mono w-full text-center">{{ recording.id }}</div>
    <div class="flex justify-between">
      <span class="text-md font-bold">{{ recording.title }}</span>
      <DurationTimer
        v-if="recording.startedAtTs"
        :started-at-ts="recording.startedAtTs"
        :ended-at-ts="recording.stoppedAtTs"
        />
    </div>
    <RecordingDownload
      v-if="recording.stoppedAtTs"
      :recording="recording"/>
    <RecordingControls
      v-else
      :recording="recording" />
  </div>
</template>

<script setup lang="ts">
import { RecordingMetadata } from './RecordingMetadata';
import DurationTimer from '../components/DurationTimer.vue'
import RecordingDownload from "./RecordingDownload.vue";
import RecordingControls from './RecordingControls.vue';

defineProps<{
  recording: RecordingMetadata;
}>();
</script>
