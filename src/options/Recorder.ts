import browser from 'webextension-polyfill';
import {
  isMessage,
  isRecordingDownloadedMessage,
  isRecordingStoppedMessage,
  isRecordMessage,
} from '../common/Message';
import { RecordingMetadata } from '../common/RecordingMetadata';
import { UUID } from '../common/types';
import { Recording } from './Recording';

export class Recorder<T extends Recording> {
  private recordings: T[] = [];

  public constructor(private readonly recordingType: new(id: UUID, title: string) => T) {
    browser.runtime.onMessage.addListener(async (message) => {
      if (!isMessage(message) || !message.dispatched) {
        return;
      }
      console.debug('<< [Recorder]', message);

      if (isRecordMessage(message)) {
        this.createAndStartRecording(message.title);
      } else if (isRecordingStoppedMessage(message)) {
        this.stopRecording(message.recording);
      } else if (isRecordingDownloadedMessage(message)) {
        this.downloadRecording(message.recording);
      }
    });
  }

  private createAndStartRecording(title: string): T {
    const id = self.crypto.randomUUID();
    const recording = new this.recordingType(id, title);
    this.recordings.push(recording);
    recording.start();
    return recording;
  }

  private getRecording(recordingMetadata: RecordingMetadata): T {
    const recording = this.recordings.find(
      (r) => r.id === recordingMetadata.id,
    );
    if (!recording) {
      throw new Error(`Recording with id ${recordingMetadata.id} not found`);
    }
    return recording;
  }

  private stopRecording(recordingMetadata: RecordingMetadata): Promise<void> | void {
    const recording = this.getRecording(recordingMetadata);
    return recording.stop();
  }

  private downloadRecording(recordingMetadata: RecordingMetadata): void {
    const recording = this.getRecording(recordingMetadata);
    recording.download();
  }
}
