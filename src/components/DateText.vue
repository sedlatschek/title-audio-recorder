<template>
  {{ date }}
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed } from 'vue';

const props = defineProps<{
  timestamp: number;
}>();

const date = computed(() => DateTime.fromMillis(props.timestamp).toLocaleString(DateTime.DATETIME_SHORT));
</script>
