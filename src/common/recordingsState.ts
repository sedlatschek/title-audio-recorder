import { Ref, ref } from "vue";
import browser from "webextension-polyfill";
import { isMessage, isRecordingAddedMessage, isRecordingStartedMessage, isRecordingStoppedMessage } from "./Message";
import { RecordingMetadata } from "./RecordingMetadata";

export function createRecordingsState(): Ref<RecordingMetadata[]> {
  const recordings = ref<RecordingMetadata[]>([]);

  browser.runtime.onMessage.addListener(async (message) => {
    if (!isMessage(message) || !message.dispatched) {
      return;
    }

    if (isRecordingAddedMessage(message)) {
      recordings.value.push(message.recording);
    } else if (isRecordingStartedMessage(message) || isRecordingStoppedMessage(message)) {
      console.log("recordingsState: recording was updated", message.recording);

      const index = recordings.value.findIndex((recording) => message.recording.id === recording.id);
      if (index !== -1) {
        recordings.value[index] = { ...recordings.value[index], ...message.recording };
      } else {
        recordings.value.push(message.recording);
      }
    }
  });

  return recordings;
}
