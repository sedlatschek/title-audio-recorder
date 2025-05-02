import { FFmpeg } from '@ffmpeg/ffmpeg';
import { createConfigurationHandler } from '../../common/components/configurationHandler';
import { createRecordingsRef, RecordingsRef } from '../../common/components/recordingsRef';
import { createTosAcceptedRef, TosAcceptedRef } from '../../common/components/tosAcceptedRef';
import { createTosHandler } from '../../common/components/tosHandler';
import { ConfigurationHandler } from '../../common/configuration/ConfigurationHandler';
import { MessageBus } from '../../common/MessageBus';
import { TosHandler } from '../../common/tos/TosHandler';
import { AutoDownloader } from '../AutoDownloader';
import { Converter } from '../converter/Converter';
import { observeTabs } from '../observeTabs';
import { Recorder } from '../recorder/Recorder';
import { Recording } from '../recorder/Recording';
import { RecordingSession } from '../recorder/RecordingSession';
import { createFFmpeg } from './ffmpeg';
import { createMessageBus } from './messageBus';
import { createRecorder } from './recorder';

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

export async function initializeComponents(): Promise<void> {
  const configurationHandler = createConfigurationHandler();
  const recorder = createRecorder();
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

export function getComponents(): OptionsComponents {
  if (optionsComponents === undefined) {
    throw new Error('Popup components not initialized');
  }
  return optionsComponents;
}
