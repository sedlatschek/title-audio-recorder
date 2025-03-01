import browser from 'webextension-polyfill';
import { EventArray } from '../../common/EventArray';
import {
  isMessage,
  isRecordingDownloadedMessage,
  isStartRecordingMessage,
  isStopRecordingMessage,
  isTabTitleChangedMessage,
  Message,
  MessageType,
} from '../../common/Message';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { Recording } from './Recording';
import { RecordingSession } from './RecordingSession';
import { RecordingSessionWrapper } from './RecordingSessionWrapper';
import { RecordingWrapper } from './RecordingWrapper';

export class Recorder<T extends RecordingSession<R>, R extends Recording> {
  private recordingSessionWrappers: Record<
    number,
    RecordingSessionWrapper<T, R>
  > = [];
  private recordingWrappers: EventArray<RecordingWrapper<R>>;

  public constructor(
    private readonly recordingSessionType: new (tabId: number) => T,
  ) {
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
        this.registerTitleChange(message.tabId, message.title, message.url);
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

  private async getRecordingSessionWrapper(
    tabId: number,
  ): Promise<RecordingSessionWrapper<T, R>> {
    const existingRecordingSessionWrapper =
      this.recordingSessionWrappers[tabId];
    if (existingRecordingSessionWrapper) {
      return existingRecordingSessionWrapper;
    }

    const recordingSessionWrapper = new RecordingSessionWrapper<T, R>(
      this.recordingSessionType,
      tabId,
    );
    this.recordingSessionWrappers[tabId] = recordingSessionWrapper;
    await recordingSessionWrapper.start();
    return recordingSessionWrapper;
  }

  private async startRecording(tabId: number): Promise<void> {
    const recordingSessionWrapper =
      await this.getRecordingSessionWrapper(tabId);
    const recordingWrapper = await recordingSessionWrapper.record();
    this.recordingWrappers.push(recordingWrapper);
  }

  private getRecordingWrapper(
    recordingMetadata: RecordingMetadata,
  ): RecordingWrapper<R> {
    const recordingWrapper = this.recordingWrappers.find(
      (r) => r.id === recordingMetadata.id,
    );
    if (!recordingWrapper) {
      throw new Error(`Recording with id ${recordingMetadata.id} not found`);
    }
    return recordingWrapper;
  }

  private async stopRecording(
    recordingMetadata: RecordingMetadata,
  ): Promise<void> {
    console.debug(`[Recorder] stop recording ${recordingMetadata.id}`);
    const recordingWrapper = this.getRecordingWrapper(recordingMetadata);
    await recordingWrapper.stop();
  }

  private downloadRecording(recordingMetadata: RecordingMetadata): void {
    console.debug(`[Recorder] download recording ${recordingMetadata.id}`);
    const recordingWrapper = this.getRecordingWrapper(recordingMetadata);
    recordingWrapper.download();
  }

  private async registerTitleChange(
    tabId: number,
    title: string,
    url: string,
  ): Promise<void> {
    const recordingSessionWrapper =
      await this.getRecordingSessionWrapper(tabId);
    const recordingWrapper = await recordingSessionWrapper.record(title, url);
    this.recordingWrappers.push(recordingWrapper);
  }

  private sendMessage(
    messageType:
      | MessageType.RECORDING_ADDED
      | MessageType.RECORDING_STARTED
      | MessageType.RECORDING_STOPPED,
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
