import { AppearanceModeChangeDetector } from '../../common/appearanceMode/AppearanceModeChangeDetector';
import { MessageBus } from '../../common/MessageBus';

export function createMessageBus(
  appearanceModeChangeDetector: AppearanceModeChangeDetector,
): MessageBus {
  const messageBus = new MessageBus('Popup');

  appearanceModeChangeDetector.onAppearanceModeChanged((appearanceMode) => {
    return messageBus.appearanceChanged(appearanceMode);
  });

  return messageBus;
}
