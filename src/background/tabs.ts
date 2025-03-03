import pRetry from 'p-retry';
import browser, { Tabs } from 'webextension-polyfill';
import { DiscoverOptionsTabMessage, MessageType } from '../common/Message';
import { getOptionPageTabs, getOptionsPageUrl } from '../common/tabs';

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
    url: getOptionsPageUrl(),
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
  const [tab] = await getOptionPageTabs();
  return tab ?? openOptionsTab();
}
