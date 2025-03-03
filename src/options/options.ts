import { createApp } from 'vue';
import browser from 'webextension-polyfill';
import { isDiscoverOptionsTabMessage } from '../common/Message';
import { getErrorPageUrl, getOptionPageTabs } from '../common/tabs';
import OptionsPage from './OptionsPage.vue';
import { Recorder } from './recorder/Recorder';
import { TabCaptureRecordingSession } from './recorder/TabCaptureRecordingSession';
import '../index.css';

initialize();

async function initialize(): Promise<void> {
  const tabs = await getOptionPageTabs();

  if (tabs.length > 1) {
    window.location.href = getErrorPageUrl();
  } else {
    createApp(OptionsPage).mount('body');

    new Recorder(TabCaptureRecordingSession);

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      console.debug('<< [options]', message);

      if (isDiscoverOptionsTabMessage(message)) {
        console.debug('>> [options] responding to discover options message');
        sendResponse(true);
        return true;
      }
    });
  }
}
