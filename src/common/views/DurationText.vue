<template>
  {{ duration }}
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  startedAtTs: number;
  stoppedAtTs?: number;
}>();

const duration = ref<string>('00:00:00');

const startedAt = computed<DateTime>(() => DateTime.fromMillis(props.startedAtTs));
const stoppedAt = computed<DateTime | undefined>(() =>
  props.stoppedAtTs ? DateTime.fromMillis(props.stoppedAtTs) : undefined,
);

function getTimeDifference(a: DateTime, b: DateTime): string {
  const durationValue = b.diff(a);
  return durationValue.toFormat('hh:mm:ss');
}

function updateDuration(): void {
  if (stoppedAt.value) {
    duration.value = getTimeDifference(startedAt.value, stoppedAt.value);
  } else {
    duration.value = getTimeDifference(startedAt.value, DateTime.now());
  }
}

let interval: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  updateDuration();

  if (!stoppedAt.value) {
    interval = setInterval(updateDuration, 1000);
  }
});

onUnmounted(() => {
  clearInterval(interval);
});

watch(
  () => props.stoppedAtTs,
  (value) => {
    if (value !== undefined) {
      clearInterval(interval);
      updateDuration();
    }
  },
);
</script>
