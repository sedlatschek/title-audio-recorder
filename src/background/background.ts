import browser, { Runtime } from 'webextension-polyfill';
import { isMessage, Message } from '../common/Message';
import { ensureOptionsTabIsOpen } from './tabs';

browser.runtime.onMessage.addListener(onMessage);

function onMessage(
  message: unknown,
  sender: Runtime.MessageSender,
  sendResponse: (message: unknown) => void,
): true | undefined {
  if (!isMessage(message)) {
    throw new Error(
      `[background] received invalid message: ${JSON.stringify(message)}`,
    );
  }

  if (message.dispatched) {
    return;
  }

  ensureOptionsTabIsOpen().then(async () => {
    const dispatchedMessage: Message = {
      ...transformMessage(message, sender),
      dispatched: true,
    };
    console.debug('>> [background]', dispatchedMessage);

    browser.runtime
      .sendMessage(dispatchedMessage)
      .then((response) => sendResponse(response))
      .catch((error) => {
        console.error('<< [background] error:', error);
        sendResponse(null);
      });
  });
  return true;
}

function transformMessage(
  message: Message,
  sender: Runtime.MessageSender,
): Message {
  const tabId = sender.tab?.id;
  return {
    ...message,
    ...(tabId && { tabId }),
  };
}
