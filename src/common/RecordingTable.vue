<template>
  <div class="flex flex-col">
    <RecordingWidget
      v-for="recording in recordings"
      :key="recording.id"
      :recording="recording"/>
  </div>
</template>

<script setup lang="ts">
import RecordingWidget from "./RecordingWidget.vue";
import { RecordingMetadata } from "./RecordingMetadata";

defineProps<{
  recordings: RecordingMetadata[];
}>();
</script>
