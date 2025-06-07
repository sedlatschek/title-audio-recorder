import { AppearanceModeChangeDetector } from '../../common/appearanceMode/AppearanceModeChangeDetector';
import { createAppearanceModeChangeDetector } from '../../common/components/appearanceModeChangeDetector';
import { createConfigurationHandler } from '../../common/components/configurationHandler';
import { createRecordingsRef, RecordingsRef } from '../../common/components/recordingsRef';
import { createTosAcceptedRef, TosAcceptedRef } from '../../common/components/tosAcceptedRef';
import { createTosHandler } from '../../common/components/tosHandler';

import { ConfigurationHandler } from '../../common/configuration/ConfigurationHandler';
import { MessageBus } from '../../common/MessageBus';
import { TosHandler } from '../../common/tos/TosHandler';
import { createMessageBus } from './messageBus';

type PopupComponents = {
  messageBus: MessageBus;
  configurationHandler: ConfigurationHandler;
  recordings: RecordingsRef;
  tosHandler: TosHandler;
  tosAccepted: TosAcceptedRef;
  appearanceModeChangeDetector: AppearanceModeChangeDetector;
};

let popupComponents: PopupComponents | undefined;

export async function initializeComponents(): Promise<void> {
  const appearanceModeChangeDetector = createAppearanceModeChangeDetector();
  const messageBus = await createMessageBus(appearanceModeChangeDetector);
  const configurationHandler = createConfigurationHandler();
  const tosHandler = createTosHandler();

  popupComponents = {
    messageBus,
    configurationHandler,
    recordings: createRecordingsRef(messageBus, true),
    tosHandler,
    tosAccepted: await createTosAcceptedRef(tosHandler),
    appearanceModeChangeDetector,
  };
}

export function getComponents(): PopupComponents {
  if (popupComponents === undefined) {
    throw new Error('Popup components not initialized');
  }
  return popupComponents;
}
