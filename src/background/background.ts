import browser, { Runtime } from 'webextension-polyfill';

import {
  isMessage,
  isTabTitleChangeDetectedMessage,
  Message,
} from '../common/Message';

browser.runtime.onMessage.addListener(async (message, sender) => {
  if (!isMessage(message)) {
    throw new Error(
      `[BG] received invalid message: ${JSON.stringify(message)}`,
    );
  }
  if (!message.dispatched) {
    const dispatchedMessage: Message = {
      ...transformMessage(message, sender),
      dispatched: true,
    };
    console.debug('>> [BG]', dispatchedMessage);
    browser.runtime.sendMessage(dispatchedMessage);
  }
});

function transformMessage(
  message: Message,
  sender: Runtime.MessageSender,
): Message {
  if (isTabTitleChangeDetectedMessage(message)) {
    const tabId = sender.tab?.id;
    if (tabId === undefined) {
      throw new Error('Can not retrieve tabId from sender');
    }
    return {
      ...message,
      tabId,
    };
  }
  return message;
}

function openTab(): Promise<browser.Tabs.Tab> {
  return browser.tabs.create({
    pinned: false,
    active: false,
    url: browser.runtime.getURL('src/options/options.html'),
  });
}

openTab();
