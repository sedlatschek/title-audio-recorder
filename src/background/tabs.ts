import browser, { Tabs } from 'webextension-polyfill';

const url = browser.runtime.getURL('src/options/options.html');

export async function getOptionsTab(): Promise<Tabs.Tab | undefined> {
  const tabs = await browser.tabs.query({ url });
  return tabs[0];
}

export async function openOptionsTab(): Promise<Tabs.Tab> {
  return browser.tabs.create({
    pinned: false,
    active: true,
    url,
  });
}

export async function ensureOptionsTabIsOpen(): Promise<Tabs.Tab> {
  const tab = await getOptionsTab();
  return tab ?? openOptionsTab();
}
