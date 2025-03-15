import browser from 'webextension-polyfill';
import { Recorder } from './recorder/Recorder';
import { Recording } from './recorder/Recording';
import { RecordingSession } from './recorder/RecordingSession';

export function observeTabs(recorder: Recorder<RecordingSession<Recording>, Recording>): void {
  browser.tabs.onRemoved.addListener((tabId) => {
    recorder.stopRecordingSessions(tabId);
  });
}
