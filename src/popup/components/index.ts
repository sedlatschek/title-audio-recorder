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
};

let popupComponents: PopupComponents | undefined;

export async function initializeComponents(): Promise<void> {
  const messageBus = createMessageBus();
  const configurationHandler = createConfigurationHandler();
  const tosHandler = createTosHandler();

  popupComponents = {
    messageBus,
    configurationHandler,
    recordings: createRecordingsRef(messageBus, true),
    tosHandler,
    tosAccepted: await createTosAcceptedRef(tosHandler),
  };
}

export function getComponents(): PopupComponents {
  if (popupComponents === undefined) {
    throw new Error('Popup components not initialized');
  }
  return popupComponents;
}
