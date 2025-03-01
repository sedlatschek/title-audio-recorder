import browser from 'webextension-polyfill';
import { MessageType } from '../common/Message';
import { HtmlTitleChangeDetector } from './HtmlTitleChangeDetector';
import { TitleChangeDetector } from './TitleChangeDetector';

const titleChangeDetector: TitleChangeDetector = new HtmlTitleChangeDetector();
titleChangeDetector.onTitleChanged((title: string, url: string) => {
  browser.runtime.sendMessage({
    messageType: MessageType.TAB_TITLE_CHANGED,
    title,
    url,
  });
});
