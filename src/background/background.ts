import browser from 'webextension-polyfill';

import {
 isMessage, Message, 
} from '../common/Message';

browser.runtime.onMessage.addListener(async (message: unknown) => {
  if (!isMessage(message)) {
    console.error('[BG] received invalid message', message);
    return;
  }
  if (!message.dispatched) {
    const dispatchedMessage: Message = {
      ...message,
      dispatched: true,
    };
    console.log('[BG] dispatched message', dispatchedMessage)
    browser.runtime.sendMessage(dispatchedMessage);
  }
});

function openTab(): Promise<browser.Tabs.Tab> {
  return browser.tabs.create(
    {
      pinned: false,
      active: false,
      url: browser.runtime.getURL('src/options/options.html'),
    },
  );
}

openTab();
