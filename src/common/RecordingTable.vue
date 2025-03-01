<template>
  <div class="pt-5">
    <RecordingWidget
      v-for="recording in recordings"
      :key="recording.id"
      class="mx-auto my-4"
      :recording="recording"
    />
  </div>
</template>

<script setup lang="ts">
import { RecordingMetadata } from './RecordingMetadata';
import RecordingWidget from './RecordingWidget.vue';

defineProps<{
  recordings: RecordingMetadata[];
}>();
</script>
