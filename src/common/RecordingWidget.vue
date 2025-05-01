<template>
  <div
    class="max-w-196 rounded-3xl bg-black/5 p-2 outline outline-white/15 backdrop-blur-md dark:bg-white/10">
    <div
      :class="{
        barberpole: !props.recording.stoppedAtTs,
        'bg-white dark:bg-stone-900': props.recording.stoppedAtTs,
      }"
      class="relative rounded-2xl p-1 outline outline-black/5">
      <div
        :class="{
          'p-6': props.padding === 'lg',
          'p-4': props.padding === 'sm',
        }"
        class="flex w-full flex-row items-center gap-6 rounded-2xl bg-white dark:bg-stone-900">
        <RecordingImage :recording="recording" />
        <div class="items-left flex flex-col">
          <span class="mb-2 text-2xl leading-none font-medium text-gray-950 dark:text-stone-100">
            {{ recording.title }}
          </span>
          <div>
            <a
              target="_blank"
              class="leading-none font-medium break-all text-sky-500 dark:text-sky-300"
              :href="recording.pageUrl">
              {{ recording.pageUrl }}
            </a>
          </div>
          <span class="flex gap-2 font-medium text-gray-600 dark:text-stone-300">
            <DateText
              v-if="recording.startedAtTs"
              :timestamp="recording.startedAtTs" />
            ·
            <DurationText
              v-if="recording.startedAtTs"
              :started-at-ts="recording.startedAtTs"
              :stopped-at-ts="recording.stoppedAtTs" />
          </span>
        </div>
        <div class="flex grow flex-row justify-end">
          <div class="flex flex-col gap-1">
            <BtnIcon
              v-if="recording.stoppedAtTs"
              tag="button"
              title="Remove recording"
              @click="remove">
              <IconTrash />
            </BtnIcon>
            <BtnIcon
              v-else
              tag="button"
              title="Stop recording"
              @click="stop">
              <IconRectangle />
            </BtnIcon>
            <BtnIcon
              tag="button"
              :color="props.recording.download.count <= 0 ? 'primary' : 'secondary'"
              title="Download recording"
              :disabled="!props.recording.download.available"
              @click="download">
              <IconArrowDown />
            </BtnIcon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BtnIcon from '../common/components/BtnIcon.vue';
import DateText from '../common/components/DateText.vue';
import DurationText from '../common/components/DurationText.vue';
import IconArrowDown from '../common/components/IconArrowDown.vue';
import IconRectangle from '../common/components/IconRectangle.vue';
import IconTrash from '../common/components/IconTrash.vue';
import { MessageBus } from './MessageBus';
import RecordingImage from './RecordingImage.vue';
import { RecordingMetadata } from './RecordingMetadata';

const props = defineProps<{
  messageBus: MessageBus;
  padding: 'sm' | 'lg';
  recording: RecordingMetadata;
}>();

function remove(): Promise<void> {
  return props.messageBus.removeRecording(props.recording);
}

function stop(): Promise<void> {
  return props.messageBus.stopRecording(props.recording);
}

async function download(): Promise<void> {
  return props.messageBus.downloadRecording(props.recording);
}
</script>

<style>
.barberpole {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 1rem,
    #ccc 1rem,
    #ccc 2rem
  );
  background-size: 200% 200%;
  animation: barberpole 10s linear infinite;
}

@keyframes barberpole {
  100% {
    background-position: 100% 100%;
  }
}
</style>
