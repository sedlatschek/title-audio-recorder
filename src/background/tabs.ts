import pRetry from 'p-retry';
import browser, { Tabs } from 'webextension-polyfill';
import { DiscoverOptionsTabMessage, MessageType } from '../common/Message';

const url = browser.runtime.getURL('src/options/options.html');

async function getOptionsTab(): Promise<Tabs.Tab | undefined> {
  const tabs = await browser.tabs.query({ url });
  return tabs[0];
}

function optionsTabIsResponding(): Promise<boolean> {
  const message: DiscoverOptionsTabMessage = {
    messageType: MessageType.DISCOVER_OPTIONS_TAB,
  };
  return browser.runtime.sendMessage<DiscoverOptionsTabMessage, boolean>(
    message,
  );
}

async function openOptionsTab(): Promise<Tabs.Tab> {
  const tab = await browser.tabs.create({
    pinned: false,
    active: false,
    url,
  });

  await pRetry(
    () => {
      console.debug('>> [background] waiting for options tab to respond');
      return optionsTabIsResponding();
    },
    {
      retries: 100,
      minTimeout: 10,
      maxTimeout: 10,
      onFailedAttempt: (error) => {
        console.warn('<< [background] options tab did not respond', error);
      },
    },
  );

  return tab;
}

export async function ensureOptionsTabIsOpen(): Promise<Tabs.Tab> {
  const tab = await getOptionsTab();
  return tab ?? openOptionsTab();
}
