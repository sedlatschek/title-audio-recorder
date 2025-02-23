<template>
  <RecordingTable :recordings="recordings" />
</template>

<script setup lang="ts">
import { createRecordingsState } from "../common/recordingsState";
import RecordingTable from "../common/RecordingTable.vue";

const recordings = createRecordingsState();
</script>
