import browser, { Runtime } from 'webextension-polyfill';

import { isMessage, Message } from '../common/Message';
import { ensureOptionsTabIsOpen } from './tabs';

export class MessageBroker {
  public constructor() {
    browser.runtime.onMessage.addListener(async (message, sender) => {
      if (!isMessage(message)) {
        throw new Error(
          `[MessageBroker] received invalid message: ${JSON.stringify(message)}`,
        );
      }
      if (!message.dispatched) {
        const dispatchedMessage: Message = {
          ...this.transformMessage(message, sender),
          dispatched: true,
        };
        console.debug('>> [MessageBroker]', dispatchedMessage);
        browser.runtime.sendMessage(dispatchedMessage);
        return ensureOptionsTabIsOpen();
      }
    });
  }

  private transformMessage(
    message: Message,
    sender: Runtime.MessageSender,
  ): Message {
    const tabId = sender.tab?.id;
    return {
      ...message,
      ...(tabId && { tabId }),
    };
  }
}
