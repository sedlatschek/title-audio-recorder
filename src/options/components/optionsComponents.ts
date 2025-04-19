import { MessageBus } from '../../common/MessageBus';
import { createRecordingsRef, RecordingsRef } from '../../common/RecordingsRef';
import { createTosHandler } from '../../common/tos/tosHandler';
import { createTosAcceptedRef, TosAcceptedRef } from '../../common/TosAcceptedRef';
import { AutoDownloader } from '../AutoDownloader';
import { BrowserStorageConfigurationHandler } from '../configuration/browserStorageConfigurationHandler';
import { ConfigurationHandler } from '../configuration/ConfigurationHandler';
import { Converter } from '../converter/Converter';
import { Recorder } from '../recorder/Recorder';
import { Recording } from '../recorder/Recording';
import { RecordingSession } from '../recorder/RecordingSession';
import { TabCaptureRecordingSession } from '../recorder/TabCaptureRecordingSession';
import { observeTabs } from '../tabObserver';
import { TosHandler } from '../tos/TosHandler';
import { createMessageBus } from './messageBus';

type OptionsComponents = {
  configurationHandler: ConfigurationHandler;
  messageBus: MessageBus;
  recorder: Recorder<RecordingSession<Recording>, Recording>;
  recordings: RecordingsRef;
  converter: Converter;
  autoDownloader: AutoDownloader;
  tosHandler: TosHandler;
  tosAccepted: TosAcceptedRef;
};

let optionsComponents: OptionsComponents | undefined;

export async function initializeOptionsComponents(): Promise<void> {
  const configurationHandler = new BrowserStorageConfigurationHandler();
  const recorder = new Recorder(TabCaptureRecordingSession);
  const messageBus = createMessageBus(recorder);
  const recordings = createRecordingsRef(messageBus, true);
  const converter = new Converter(configurationHandler);
  const tosHandler = createTosHandler();
  const tosAccepted = await createTosAcceptedRef(tosHandler);

  optionsComponents = {
    configurationHandler,
    messageBus,
    recorder,
    recordings,
    converter,
    autoDownloader: new AutoDownloader(configurationHandler, recorder),
    tosHandler,
    tosAccepted,
  };

  observeTabs(recorder);
}

export function getOptionsComponents(): OptionsComponents {
  if (optionsComponents === undefined) {
    throw new Error('Popup components not initialized');
  }
  return optionsComponents;
}
