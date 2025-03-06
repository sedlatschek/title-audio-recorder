import { EnrichedTabTitleChangeMessageTab } from '../common/Message';
import { MessageBus } from '../common/MessageBus';
import { RecordingMetadata } from '../common/RecordingMetadata';
import { Converter } from './converter/Converter';
import { Recorder } from './recorder/Recorder';
import { Recording } from './recorder/Recording';
import { RecordingSession } from './recorder/RecordingSession';
import { TabCaptureRecordingSession } from './recorder/TabCaptureRecordingSession';
import { Settings } from './settings/settings';

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

let settings: Settings | undefined;

export function getSettings(): Settings {
  if (settings === undefined) {
    settings = new Settings();
  }
  return settings;
}

let converter: Converter | undefined;

export function getConverter(): Converter {
  if (converter === undefined) {
    converter = new Converter(getSettings());
  }
  return converter;
}
