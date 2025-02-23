import browser from "webextension-polyfill";

import { TabCaptureRecording } from "./TabCaptureRecording";
import { isMessage, isRecordingDownloadedMessage, isRecordingStoppedMessage, isRecordMessage } from "../common/Message";
import { RecordingMetadata } from "../common/RecordingMetadata";

export class TabCaptureRecorder {
  private tabCaptureRecordings: TabCaptureRecording[];

  public constructor() {
    this.tabCaptureRecordings = [];

    browser.runtime.onMessage.addListener(async (message) => {
      if (!isMessage(message) || !message.dispatched) {
        return;
      }
      console.log("TabCaptureRecorder <<", message);

      if (isRecordMessage(message)) {
        this.createAndStartTabCapture(message.title);
      } else if (isRecordingStoppedMessage(message)) {
        this.stopTabCapture(message.recording);
      } else if (isRecordingDownloadedMessage(message)) {
        this.downloadTabCapture(message.recording);
      }
    });
  }

  private createAndStartTabCapture(title: string): TabCaptureRecording {
    const tabCapture = new TabCaptureRecording(self.crypto.randomUUID(), title);
    this.tabCaptureRecordings.push(tabCapture);
    tabCapture.start();
    return tabCapture;
  }

  private getTabCapture(recording: RecordingMetadata): TabCaptureRecording
  {
    const tabCapture =  this.tabCaptureRecordings.find(tabCaptureRecording => tabCaptureRecording.id === recording.id);
    if (!tabCapture) {
      throw Error(`TabCapture with id ${recording.id} not found`);
    }
    return tabCapture;
  }

  private stopTabCapture(recording: RecordingMetadata): Promise<void>
  {
    const tabCapture = this.getTabCapture(recording);
    return tabCapture.stop()
  }

  private downloadTabCapture(recording: RecordingMetadata): void {
    const tabCapture = this.getTabCapture(recording);
    tabCapture.download();
  }
}
