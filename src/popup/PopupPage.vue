<template>
  <div class="w-96 px-2 py-3">
    <div class="flex w-full flex-col items-center justify-center">
      <div>
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
      <div>
        <BaseCheckbox
          id="number-recordings"
          v-model="numberRecordings"
          class="mt-3"
          title="Number recordings (01, 02, 03...)"
          :disabled="!tosAccepted || currentTabRecordings.length > 0">
          Number recordings
        </BaseCheckbox>
      </div>
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
import { computed, onMounted, ref } from 'vue';
import BaseCheckbox from '../common/views/BaseCheckbox.vue';
import BtnText from '../common/views/BtnText.vue';
import IconCaretLeft from '../common/views/IconCaretLeft.vue';
import IconCircle from '../common/views/IconCircle.vue';
import RecordingWidget from '../common/views/RecordingWidget.vue';
import { getComponents } from './components';
import { PopupPageProps } from './PopupPageProps';

const { messageBus, configurationHandler, recordings, tosAccepted } = getComponents();
const props = defineProps<PopupPageProps>();

const numberRecordings = ref(false);

async function start(): Promise<void> {
  await messageBus.startRecording(props.tabId, numberRecordings.value);
  await saveSettings();
}

const currentTabRecordings = computed(() =>
  recordings.value.filter((r) => r.tabId === props.tabId && !r.stoppedAtTs),
);

const buttonTitle = computed(() =>
  currentTabRecordings.value.length > 0 ? 'Restart recording' : 'Start recording',
);

onMounted(async () => {
  await restoreSettings();
});

async function restoreSettings(): Promise<void> {
  numberRecordings.value = await configurationHandler.get('numberRecordings');
}

function saveSettings(): Promise<void> {
  return configurationHandler.set('numberRecordings', numberRecordings.value);
}
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
