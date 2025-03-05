import { Ref, ref } from 'vue';
import { MessageBus } from './MessageBus';
import { RecordingMetadata } from './RecordingMetadata';

export function createRecordingsState(
  messageBus: MessageBus,
  startWithExistingRecordings?: true,
): Ref<RecordingMetadata[]> {
  const recordingMetadatas = ref<RecordingMetadata[]>([]);

  if (startWithExistingRecordings) {
    messageBus.getRecordings().then((recordings) => {
      console.debug('[recordingsState] got existing recordings', recordings);
      recordingMetadatas.value.push(...recordings);
    });
  }

  const handleAdded = (recording: RecordingMetadata): Promise<void> => {
    console.debug('[recordingsState] recording was added', recording);
    recordingMetadatas.value.push(recording);
    return Promise.resolve();
  };
  const handleChanged = (recording: RecordingMetadata): Promise<void> => {
    console.debug('[recordingsState] recording was updated', recording);

    const index = recordingMetadatas.value.findIndex((r) => r.id === recording.id);
    if (index !== -1) {
      recordingMetadatas.value[index] = {
        ...recordingMetadatas.value[index],
        ...recording,
      };
    } else {
      recordingMetadatas.value.push(recording);
    }

    return Promise.resolve();
  };

  messageBus.onRecordingAdded(handleAdded);
  messageBus.onRecordingStarted(handleChanged);
  messageBus.onRecordingStopped(handleChanged);

  return recordingMetadatas;
}
