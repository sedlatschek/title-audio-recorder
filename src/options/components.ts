import { TabTitleChangedMessageTab } from '../common/Message';
import { MessageBus } from '../common/MessageBus';
import { RecordingMetadata } from '../common/RecordingMetadata';
import { Recorder } from './recorder/Recorder';
import { Recording } from './recorder/Recording';
import { RecordingSession } from './recorder/RecordingSession';
import { TabCaptureRecordingSession } from './recorder/TabCaptureRecordingSession';

type RecorderType = Recorder<RecordingSession<Recording>, Recording>;

let recorder: RecorderType | undefined;

export function getRecorder(): RecorderType {
  if (recorder === undefined) {
    recorder = new Recorder(TabCaptureRecordingSession);
  }
  return recorder;
}

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
    return Promise.resolve(recorder.startRecording(tabId));
  });

  messageBus.onStopRecording((recordingMetadata: RecordingMetadata) => {
    return Promise.resolve(recorder.stopRecording(recordingMetadata));
  });

  messageBus.onDownloadRecording((recordingMetadata: RecordingMetadata) => {
    return Promise.resolve(recorder.downloadRecording(recordingMetadata));
  });

  messageBus.onTabTitleChanged((tab: TabTitleChangedMessageTab) => {
    const { tabId, title, url } = tab;
    return Promise.resolve(recorder.registerTitleChange(tabId, url, title));
  });

  recorder.on('recordingAdded', (recordingMetadata) => {
    messageBus.recordingAdded(recordingMetadata);
  });

  recorder.on('recordingStarted', (recordingMetadata) => {
    messageBus.recordingStarted(recordingMetadata);
  });

  recorder.on('recordingStopped', (recordingMetadata) => {
    messageBus.recordingStopped(recordingMetadata);
  });

  return messageBus;
}
