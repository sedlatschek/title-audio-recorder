<template>
  {{ duration }}s
</template>

<script setup lang="ts">
const props = defineProps<{
  startedAtTs: number;
  endedAtTs?: number;
}>();

import { DateTime } from 'luxon';
import {
 onMounted, onUnmounted, ref, 
} from 'vue';

let interval: ReturnType<typeof setInterval> | undefined;
const duration = ref('0');

onMounted(() => {
  interval = setInterval(() => {
    duration.value = (((props.endedAtTs ? props.endedAtTs : DateTime.now().toMillis()) - props.startedAtTs) / 1000).toFixed(0);
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
