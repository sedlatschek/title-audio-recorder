import { MessageBus } from '../common/MessageBus';
import { createRecordingsRef, RecordingsRef } from '../common/RecordingsRef';
import { createTosHandler } from '../common/tos/tosHandler';
import { createTosAcceptedRef, TosAcceptedRef } from '../common/TosAcceptedRef';
import { TosHandler } from '../options/tos/TosHandler';

type PopupComponents = {
  messageBus: MessageBus;
  recordings: RecordingsRef;
  tosHandler: TosHandler;
  tosAccepted: TosAcceptedRef;
};

let popupComponents: PopupComponents | undefined;

export async function initializePopupComponents(): Promise<void> {
  const messageBus = new MessageBus('Popup');
  const tosHandler = createTosHandler();

  popupComponents = {
    messageBus,
    recordings: createRecordingsRef(messageBus, true),
    tosHandler,
    tosAccepted: await createTosAcceptedRef(tosHandler),
  };
}

export function getPopupComponents(): PopupComponents {
  if (popupComponents === undefined) {
    throw new Error('Popup components not initialized');
  }
  return popupComponents;
}
