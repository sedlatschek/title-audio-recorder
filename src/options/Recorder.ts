import browser from 'webextension-polyfill';
import { EventArray } from '../common/EventArray';
import {
  isMessage,
  isRecordingDownloadedMessage,
  isStartRecordingMessage,
  isStopRecordingMessage,
  isTabTitleChangedMessage,
  Message,
  MessageType,
} from '../common/Message';
import { RecordingMetadata } from '../common/RecordingMetadata';
import { Recording } from './Recording';
import { RecordingSession } from './RecordingSession';
import { RecordingStream } from './RecordingStream';
import { RecordingWrapper } from './RecordingWrapper';

export class Recorder<T extends RecordingStream<R>, R extends Recording> {
  private recordingSessions: Record<number, RecordingSession<T, R>> = [];
  private recordingWrappers: EventArray<RecordingWrapper<R>>;

  public constructor(private readonly recordingStreamType: new(tabId: number) => T) {
    this.recordingWrappers = new EventArray<RecordingWrapper<R>>();

    this.recordingWrappers.on('push', (items: RecordingWrapper<R>[]): void => {
      for (const item of items) {
        this.initializeRecording(item);
      }
    });

    browser.runtime.onMessage.addListener(async (message) => {
      if (!isMessage(message) || !message.dispatched) {
        return;
      }
      console.debug('<< [Recorder]', message);

      if (isStartRecordingMessage(message)) {
        this.startRecording(message.tabId);
      } else if (isStopRecordingMessage(message)) {
        this.stopRecording(message.recording);
      } else if (isRecordingDownloadedMessage(message)) {
        this.downloadRecording(message.recording);
      } else if (isTabTitleChangedMessage(message)) {
        this.registerTitleChange(message.tabId, message.title);
      }
    });
  }

  private initializeRecording(recordingWrapper: RecordingWrapper<R>): void {
    this.sendMessage(MessageType.RECORDING_ADDED, recordingWrapper);
    recordingWrapper.on('started', () => {
      this.sendMessage(MessageType.RECORDING_STARTED, recordingWrapper);
    });
    recordingWrapper.on('stopped', () => {
      this.sendMessage(MessageType.RECORDING_STOPPED, recordingWrapper);
    });
  }

  private async getRecordingSession(tabId: number): Promise<RecordingSession<T, R>> {
    const existingRecordingSession = this.recordingSessions[tabId];
    if (existingRecordingSession) {
      return existingRecordingSession;
    }

    const recordingStream = new RecordingSession<T, R>(this.recordingStreamType, tabId);
    this.recordingSessions[tabId] = recordingStream;
    await recordingStream.start();
    return recordingStream;
  }

  private async startRecording(tabId: number): Promise<void> {
    const recordingSession = await this.getRecordingSession(tabId);
    const recording = await recordingSession.record();
    this.recordingWrappers.push(recording);
  }

  private getRecordingWrapper(recordingMetadata: RecordingMetadata): RecordingWrapper<R> {
    const recordingWrapper = this.recordingWrappers.find(
      (r) => r.id === recordingMetadata.id,
    );
    if (!recordingWrapper) {
      throw new Error(`Recording with id ${recordingMetadata.id} not found`);
    }
    return recordingWrapper;
  }

  private async stopRecording(recordingMetadata: RecordingMetadata): Promise<void> {
    console.debug(`[Recorder] stop recording ${recordingMetadata.id}`);
    const recordingWrapper = this.getRecordingWrapper(recordingMetadata);
    await recordingWrapper.stop();
  }

  private downloadRecording(recordingMetadata: RecordingMetadata): void {
    console.debug(`[Recorder] download recording ${recordingMetadata.id}`);
    const recordingWrapper = this.getRecordingWrapper(recordingMetadata);
    recordingWrapper.download();
  }

  private async registerTitleChange(tabId: number, title: string): Promise<void> {
    const recordingSession = await this.getRecordingSession(tabId);
    const recordingWrapper = await recordingSession.record(title);
    this.recordingWrappers.push(recordingWrapper);
  }

  private sendMessage(
    messageType: MessageType.RECORDING_ADDED |  MessageType.RECORDING_STARTED | MessageType.RECORDING_STOPPED,
    recordingWrapper: RecordingWrapper<R>,
  ): void {
    const message: Message = {
      messageType,
      recording: recordingWrapper.getRecordingMetadata(),
    };
    console.debug('>> [Recorder]', message);
    browser.runtime.sendMessage(message);
  }
}
