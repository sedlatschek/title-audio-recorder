import browser from 'webextension-polyfill';
import { MessageType, TabTitleChangedMessage, TabTitleChangedMessageTab } from '../common/Message';
import { createTitleChangeDetector } from './components/titleChangeDetector';

type TabTitleChangedMessageTabWithoutTabId = Omit<TabTitleChangedMessageTab, 'tabId'>;
type TabTitleChangedMessageWithoutTabId = Omit<TabTitleChangedMessage, 'tab'> & {
  tab: TabTitleChangedMessageTabWithoutTabId;
};

const titleChangeDetector = createTitleChangeDetector();
titleChangeDetector.onTitleChanged((title: string, url: string) => {
  const message: TabTitleChangedMessageWithoutTabId = {
    messageType: MessageType.TAB_TITLE_CHANGED,
    tab: {
      title,
      url,
    },
  };
  browser.runtime.sendMessage(message);
});
