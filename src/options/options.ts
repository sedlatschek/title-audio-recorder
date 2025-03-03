import { createApp } from 'vue';
import browser from 'webextension-polyfill';
import { isDiscoverOptionsTabMessage } from '../common/Message';
import OptionsPage from './OptionsPage.vue';
import '../index.css';
import { Recorder } from './recorder/Recorder';
import { TabCaptureRecordingSession } from './recorder/TabCaptureRecordingSession';

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
