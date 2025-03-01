<template>
  <img
    v-if="url.protocol === 'https:'"
    :alt="`Icon of ${url.hostname}`"
    class="size-8 rounded-md drop-shadow-lg filter dark:outline-1 dark:-outline-offset-1 dark:outline-white/10"
    :src="`https://icons.duckduckgo.com/ip3/${url.hostname}.ico`"
    width="32"
    height="32" />
  <div
    v-else
    class="size-8" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RecordingMetadata } from './RecordingMetadata';

const props = defineProps<{
  recording: RecordingMetadata;
}>();

const url = computed<URL>(() => new URL(props.recording.url));
</script>
