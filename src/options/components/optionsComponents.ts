import { FFmpeg } from '@ffmpeg/ffmpeg';
import { BrowserStorageConfigurationHandler } from '../../common/configuration/browserStorageConfigurationHandler';
import { ConfigurationHandler } from '../../common/configuration/ConfigurationHandler';
import { createRecordingsRef, RecordingsRef } from '../../common/createRecordingsRef';
import { MessageBus } from '../../common/MessageBus';
import { createTosAcceptedRef, TosAcceptedRef } from '../../common/tos/createTosAcceptedRef';
import { createTosHandler } from '../../common/tos/createTosHandler';
import { TosHandler } from '../../common/tos/TosHandler';
import { AutoDownloader } from '../AutoDownloader';
import { Converter } from '../converter/Converter';
import { observeTabs } from '../observeTabs';
import { Recorder } from '../recorder/Recorder';
import { Recording } from '../recorder/Recording';
import { RecordingSession } from '../recorder/RecordingSession';
import { TabCaptureRecordingSession } from '../recorder/TabCaptureRecordingSession';
import { createFFmpeg } from './ffmpeg';
import { createMessageBus } from './messageBus';

type OptionsComponents = {
  configurationHandler: ConfigurationHandler;
  messageBus: MessageBus;
  recorder: Recorder<RecordingSession<Recording>, Recording>;
  recordings: RecordingsRef;
  ffmpeg: FFmpeg;
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
  const ffmpeg = await createFFmpeg();
  const converter = new Converter(configurationHandler);
  const autoDownloader = new AutoDownloader(configurationHandler, recorder);
  const tosHandler = createTosHandler();
  const tosAccepted = await createTosAcceptedRef(tosHandler);

  optionsComponents = {
    configurationHandler,
    messageBus,
    recorder,
    recordings,
    ffmpeg,
    converter,
    autoDownloader,
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
