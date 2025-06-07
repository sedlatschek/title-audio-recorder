import { AppearanceModeChangeDetector } from '../../common/appearanceMode/AppearanceModeChangeDetector';
import {
  EnrichedTabTitleChangeMessageTab,
  StartRecordingMessagePayload,
} from '../../common/Message';
import { MessageBus } from '../../common/MessageBus';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { StorageHandler } from '../../common/storage/StorageHandler';
import { IconSwitcher } from '../IconSwitcher';
import { Recorder } from '../recorder/Recorder';
import { Recording } from '../recorder/Recording';
import { RecordingSession } from '../recorder/RecordingSession';

export function createMessageBus(
  recorder: Recorder<RecordingSession<Recording>, Recording>,
  storageHandler: StorageHandler,
  iconSwitcher: IconSwitcher,
  appearanceModeChangeDetector: AppearanceModeChangeDetector,
): MessageBus {
  const messageBus = new MessageBus('Options');

  messageBus.onDiscoverOptionsTab(() => {
    return Promise.resolve(1);
  });

  messageBus.onGetRecordings(() => {
    return recorder.getRecordingMetadatas();
  });

  messageBus.onStartRecording(({ tabId, numberRecordings }: StartRecordingMessagePayload) => {
    return recorder.startRecordingSession(tabId, numberRecordings);
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

  messageBus.onAppearanceChanged(async (appearanceMode) => {
    await Promise.all([
      storageHandler.set('appearanceMode', appearanceMode),
      iconSwitcher.switchTo(appearanceMode),
    ]);
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

  appearanceModeChangeDetector.onAppearanceModeChanged(async (appearanceMode) => {
    await messageBus.appearanceChanged(appearanceMode);
  });

  return messageBus;
}
