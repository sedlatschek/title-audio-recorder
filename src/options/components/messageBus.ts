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
    return Promise.resolve(recorder.getRecordingMetadatas());
  });

  messageBus.onStartRecording((tabId: number) => {
    return Promise.resolve(recorder.startRecordingSession(tabId));
  });

  messageBus.onStopRecording((recordingMetadata: RecordingMetadata) => {
    return Promise.resolve(recorder.stopRecording(recordingMetadata));
  });

  messageBus.onTabTitleChanged((tab: EnrichedTabTitleChangeMessageTab) => {
    const { tabId, title, url } = tab;
    return Promise.resolve(recorder.registerTitleChange(tabId, title, url));
  });

  recorder.onRecordingAdded((recordingMetadata) => {
    messageBus.recordingAdded(recordingMetadata);
    return Promise.resolve();
  });

  recorder.onRecordingUpdated((recordingMetadata) => {
    messageBus.recordingUpdated(recordingMetadata);
    return Promise.resolve();
  });

  return messageBus;
}
