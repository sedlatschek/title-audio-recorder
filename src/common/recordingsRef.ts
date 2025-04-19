import { Ref, ref } from 'vue';
import { MessageBus } from './MessageBus';
import { RecordingMetadata } from './RecordingMetadata';

export type RecordingsRef = Ref<RecordingMetadata[]>;

export function createRecordingsRef(
  messageBus: MessageBus,
  startWithExistingRecordings?: true,
): RecordingsRef {
  const recordingMetadatas = ref<RecordingMetadata[]>([]);

  if (startWithExistingRecordings) {
    messageBus.getRecordings().then((recordings) => {
      console.debug('[recordingsRef] got existing recordings', recordings);
      recordingMetadatas.value.push(...recordings);
    });
  }

  messageBus.onRecordingAdded((recording: RecordingMetadata): Promise<void> => {
    console.debug('[recordingsRef] recording was added', recording);
    recordingMetadatas.value.push(recording);
    return Promise.resolve();
  });

  messageBus.onRecordingUpdated((recording: RecordingMetadata): Promise<void> => {
    console.debug('[recordingsRef] recording was updated', recording);

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
  });

  messageBus.onRecordingRemoved((recording: RecordingMetadata): Promise<void> => {
    console.debug('[recordingsRef] recording was removed', recording);

    const index = recordingMetadatas.value.findIndex((r) => r.id === recording.id);
    if (index !== -1) {
      recordingMetadatas.value.splice(index, 1);
    }

    return Promise.resolve();
  });

  return recordingMetadatas;
}
