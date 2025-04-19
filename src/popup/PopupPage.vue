<template>
  <div class="w-96 p-2">
    <div class="flex w-full justify-center">
      <BtnText
        tag="button"
        color="primary"
        :title="buttonTitle"
        :disabled="!tosAccepted"
        @click="start">
        <IconCaretLeft v-if="currentTabRecordings.length > 0" />
        <IconCircle v-else />
        <span class="ms-2">{{ buttonTitle }}</span>
      </BtnText>
    </div>
    <div
      v-if="currentTabRecordings.length > 0"
      class="mt-4">
      <RecordingWidget
        v-for="recording in currentTabRecordings"
        :key="recording.id"
        :message-bus="messageBus"
        padding="sm"
        :recording="recording" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RecordingWidget from '../common/RecordingWidget.vue';
import BtnText from '../components/BtnText.vue';
import IconCaretLeft from '../components/IconCaretLeft.vue';
import IconCircle from '../components/IconCircle.vue';
import { getPopupComponents } from './popupComponents';
import { PopupPageProps } from './PopupPageProps';

const { messageBus, recordings, tosAccepted } = getPopupComponents();
const props = defineProps<PopupPageProps>();

function start(): Promise<void> {
  return messageBus.startRecording(props.tabId);
}

const currentTabRecordings = computed(() =>
  recordings.value.filter((r) => r.tabId === props.tabId && !r.stoppedAtTs),
);

const buttonTitle = computed(() =>
  currentTabRecordings.value.length > 0 ? 'Restart recording' : 'Start recording',
);
</script>

<style lang="css">
body {
  background-color: #f4f4f4;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #222020;
  }
}
</style>
