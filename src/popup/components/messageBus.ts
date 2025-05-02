import { MessageBus } from '../../common/MessageBus';

export function createMessageBus(): MessageBus {
  return new MessageBus('Popup');
}
