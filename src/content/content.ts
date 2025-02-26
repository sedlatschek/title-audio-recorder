import browser from 'webextension-polyfill';
import { MessageType, TabTitleChangeDetectedMessage } from '../common/Message';
import { HtmlTitleChangeDetector } from './HtmlTitleChangeDetector';
import { TitleChangeDetector } from './TitleChangeDetector';

const titleChangeDetector: TitleChangeDetector = new HtmlTitleChangeDetector();
titleChangeDetector.onTitleChanged((title: string) => {
  const message: TabTitleChangeDetectedMessage = {
    messageType: MessageType.TAB_TITLE_CHANGED,
    title,
  };
  browser.runtime.sendMessage(message);
});
