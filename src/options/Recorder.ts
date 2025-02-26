import browser from 'webextension-polyfill';
import {
  isMessage,
  isRecordingDownloadedMessage,
  isRecordingStoppedMessage,
  isRecordMessage,
  isTabTitleChangedMessage,
} from '../common/Message';
import { RecordingMetadata } from '../common/RecordingMetadata';
import { Recording } from './Recording';
import { RecordingSession } from './RecordingSession';
import { RecordingStream } from './RecordingStream';

export class Recorder<T extends RecordingStream> {
  private recordingSessions: Record<number, RecordingSession<T>> = [];
  private recordings: Recording[] = [];

  public constructor(private readonly recordingStreamType: new(tabId: number) => T) {
    browser.runtime.onMessage.addListener(async (message) => {
      if (!isMessage(message) || !message.dispatched) {
        return;
      }
      console.debug('<< [Recorder]', message);

      if (isRecordMessage(message)) {
        this.startRecording(message.tabId);
      } else if (isRecordingStoppedMessage(message)) {
        this.stopRecording(message.recording);
      } else if (isRecordingDownloadedMessage(message)) {
        this.downloadRecording(message.recording);
      } else if (isTabTitleChangedMessage(message)) {
        this.registerTitleChange(message.tabId, message.title);
      }
    });
  }

  private async getRecordingSession(tabId: number): Promise<RecordingSession<T>> {
    const existingRecordingSession = this.recordingSessions[tabId];
    if (existingRecordingSession) {
      return existingRecordingSession;
    }

    const recordingStream = new RecordingSession(this.recordingStreamType, tabId);
    this.recordingSessions[tabId] = recordingStream;
    await recordingStream.start();
    return recordingStream;
  }

  private async startRecording(tabId: number): Promise<void> {
    const recordingSession = await this.getRecordingSession(tabId);
    const recording = await recordingSession.record();
    this.recordings.push(recording);
  }

  private getRecording(recordingMetadata: RecordingMetadata): Recording {
    const recording = this.recordings.find(
      (r) => r.id === recordingMetadata.id,
    );
    if (!recording) {
      throw new Error(`Recording with id ${recordingMetadata.id} not found`);
    }
    return recording;
  }

  private stopRecording(recordingMetadata: RecordingMetadata): Promise<void> {
    console.debug(`[Recorder] stop recording ${recordingMetadata.id}`);
    const recording = this.getRecording(recordingMetadata);
    return recording.stop();
  }

  private downloadRecording(recordingMetadata: RecordingMetadata): void {
    console.debug(`[Recorder] download recording ${recordingMetadata.id}`);
    const recording = this.getRecording(recordingMetadata);
    recording.download();
  }

  private async registerTitleChange(tabId: number, title: string): Promise<void> {
    const recordingSession = await this.getRecordingSession(tabId);
    const recording = await recordingSession.record(title);
    this.recordings.push(recording);
  }
}
