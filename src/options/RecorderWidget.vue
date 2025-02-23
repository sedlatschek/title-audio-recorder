<template>
  <RecordingTable :recordings="recordings" />
</template>

<script setup lang="ts">
import RecordingTable from "../common/RecordingTable.vue";
import { createRecordingsState } from "../common/recordingsState";

const recordings = createRecordingsState();
</script>
