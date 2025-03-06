import browser, { Tabs } from 'webextension-polyfill';

export function getErrorPageUrl(): string {
  return browser.runtime.getURL('error.html');
}

export function getOptionsPageUrl(): string {
  return browser.runtime.getURL('src/options/options.html');
}

export function getOptionPageTabs(): Promise<Tabs.Tab[]> {
  return browser.tabs.query({ url: getOptionsPageUrl() });
}

export async function getCurrentTabId(): Promise<number> {
  const [tab] = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (!tab?.id) {
    throw new Error('Could not retrieve currently active tab');
  }
  return tab.id;
}
