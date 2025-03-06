<template>
  <div class="w-96 p-2">
    <div class="flex w-full justify-center">
      <BtnIcon
        class="w-38"
        :title="buttonTitle"
        @click="start">
        <IconCaretLeft v-if="currentRecordings.length > 0" />
        <IconCircle v-else />
        <span class="ms-2">{{ buttonTitle }}</span>
      </BtnIcon>
    </div>
    <div
      v-if="currentRecordings.length > 0"
      class="mt-4">
      <RecordingWidget
        v-for="recording in currentRecordings"
        :key="recording.id"
        :message-bus="messageBus"
        padding="sm"
        :recording="recording" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MessageBus } from '../common/MessageBus';
import { createRecordingsRef } from '../common/recordingsRef';
import RecordingWidget from '../common/RecordingWidget.vue';
import BtnIcon from '../components/BtnIcon.vue';
import IconCaretLeft from '../components/IconCaretLeft.vue';
import IconCircle from '../components/IconCircle.vue';

const props = defineProps<{
  messageBus: MessageBus;
  tabId: number;
}>();

function start(): Promise<void> {
  return props.messageBus.startRecording(props.tabId);
}

const recordings = createRecordingsRef(props.messageBus, true);

const currentRecordings = computed(() =>
  recordings.value.filter((r) => r.tabId === props.tabId && !r.stoppedAtTs),
);

const buttonTitle = computed(() =>
  currentRecordings.value.length > 0 ? 'Restart recording' : 'Start recording',
);
</script>
