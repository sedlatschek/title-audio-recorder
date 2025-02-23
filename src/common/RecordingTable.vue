<template>
  <div class="flex flex-col">
    <RecordingWidget
      v-for="recording in recordings"
      :key="recording.id"
      :recording="recording"
    />
  </div>
</template>

<script setup lang="ts">
import { RecordingMetadata } from "./RecordingMetadata";
import RecordingWidget from "./RecordingWidget.vue";

defineProps<{
  recordings: RecordingMetadata[];
}>();
</script>
