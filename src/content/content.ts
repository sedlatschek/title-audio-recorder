import browser from 'webextension-polyfill';

import { HtmlTitleChangeDetector } from './HtmlTitleChangeDetector';
import { TitleChangeDetector } from './TitleChangeDetector';

const titleChangeDetector: TitleChangeDetector = new HtmlTitleChangeDetector();
titleChangeDetector.onTitleChanged((title: string) => {
  console.log('Title changed to ' + title);
});

browser.runtime.onMessage.addListener((message): Promise<void> => {
  console.log('content <<', message);
  return Promise.resolve();
});
