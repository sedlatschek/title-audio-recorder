import { EnrichedTabTitleChangeMessageTab } from '../../common/Message';
import { MessageBus } from '../../common/MessageBus';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { Recorder } from '../recorder/Recorder';
import { Recording } from '../recorder/Recording';
import { RecordingSession } from '../recorder/RecordingSession';
import { getRecorder } from './recorder';

let messageBus: MessageBus | undefined;

export function getMessageBus(): MessageBus {
  if (messageBus === undefined) {
    messageBus = createMessageBus(getRecorder());
  }
  return messageBus;
}

function createMessageBus(recorder: Recorder<RecordingSession<Recording>, Recording>): MessageBus {
  const messageBus = new MessageBus('Options');

  messageBus.onDiscoverOptionsTab(() => {
    return Promise.resolve(1);
  });

  messageBus.onGetRecordings(() => {
    return recorder.getRecordingMetadatas();
  });

  messageBus.onStartRecording((tabId: number) => {
    return recorder.startRecordingSession(tabId);
  });

  messageBus.onStopRecording((recordingMetadata: RecordingMetadata) => {
    return recorder.stopRecording(recordingMetadata);
  });

  messageBus.onDownloadRecording((recordingMetadata: RecordingMetadata) => {
    return recorder.downloadRecording(recordingMetadata);
  });

  messageBus.onRemoveRecording((recordingMetadata: RecordingMetadata) => {
    return recorder.removeRecording(recordingMetadata);
  });

  messageBus.onTabTitleChanged((tab: EnrichedTabTitleChangeMessageTab) => {
    const { tabId, title, url } = tab;
    return recorder.registerTitleChange(tabId, title, url);
  });

  recorder.onRecordingAdded(async (recordingMetadata) => {
    await messageBus.recordingAdded(recordingMetadata);
  });

  recorder.onRecordingUpdated(async (recordingMetadata) => {
    await messageBus.recordingUpdated(recordingMetadata);
  });

  recorder.onRecordingBlobAdded(async ({ recording, recordingBlob }) => {
    await messageBus.recordingBlobAdded({ recording, recordingBlob });
  });

  recorder.onRecordingRemoved(async (recordingMetadata) => {
    await messageBus.recordingRemoved(recordingMetadata);
  });

  return messageBus;
}
