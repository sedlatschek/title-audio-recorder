import { EventArray } from '../../common/EventArray';
import { PubSub } from '../../common/PubSub';
import { RecordingDownload, RecordingMetadata } from '../../common/RecordingMetadata';
import { RecordingDownloadAdded } from '../../common/types';
import { Recording } from './Recording';
import { RecordingSession } from './RecordingSession';
import { RecordingSessionWrapper } from './RecordingSessionWrapper';
import { RecordingWrapper } from './RecordingWrapper';

export class Recorder<T extends RecordingSession<R>, R extends Recording> {
  private recordingAddedPubSub = new PubSub<RecordingMetadata, void>();
  private recordingUpdatedPubSub = new PubSub<RecordingMetadata, void>();
  private recordingBlobAddedPubSub = new PubSub<RecordingDownloadAdded, void>();
  private recordingRemovedPubSub = new PubSub<RecordingMetadata, void>();

  private recordingSessionWrappers: RecordingSessionWrapper<T, R>[] = [];
  private recordingWrappers: EventArray<RecordingWrapper<R>>;

  public constructor(private readonly recordingSessionType: new (tabId: number) => T) {
    this.recordingWrappers = new EventArray<RecordingWrapper<R>>();

    this.recordingWrappers.onPush((items: RecordingWrapper<R>[]): Promise<void> => {
      for (const item of items) {
        this.initializeRecording(item);
      }
      return Promise.resolve();
    });
  }

  onRecordingAdded(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.recordingAddedPubSub.on(callback);
  }

  onRecordingUpdated(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.recordingUpdatedPubSub.on(callback);
  }

  onRecordingDownloadAdded(
    callback: (args: {
      recording: RecordingMetadata;
      recordingDownload: RecordingDownload;
    }) => Promise<void>,
  ): void {
    this.recordingBlobAddedPubSub.on(callback);
  }

  onRecordingRemoved(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.recordingRemovedPubSub.on(callback);
  }

  public async getRecordingMetadatas(): Promise<RecordingMetadata[]> {
    return Array.from(
      await Promise.all(this.recordingWrappers.map((r) => r.getRecordingMetadata())),
    );
  }

  private async initializeRecording(recordingWrapper: RecordingWrapper<R>): Promise<void> {
    this.recordingAddedPubSub.emit(await recordingWrapper.getRecordingMetadata());

    const update = async (): Promise<void> => {
      this.recordingUpdatedPubSub.emit(await recordingWrapper.getRecordingMetadata());
      return Promise.resolve();
    };

    recordingWrapper.onStarted(update);
    recordingWrapper.onStopped(update);
    recordingWrapper.onUpdated(update);

    recordingWrapper.onDownloadAdded(
      async (recordingDownload: RecordingDownload): Promise<void> => {
        const recordingMetadata = await recordingWrapper.getRecordingMetadata();
        this.recordingBlobAddedPubSub.emit({
          recording: recordingMetadata,
          recordingDownload,
        });
      },
    );
  }

  private getRunningRecordingSessionWrapper(
    tabId: number,
  ): RecordingSessionWrapper<T, R> | undefined {
    return this.recordingSessionWrappers.find((r) => r.state === 'started' && r.tabId === tabId);
  }

  private async getOrCreateStartedRecordingSessionWrapper(
    tabId: number,
  ): Promise<RecordingSessionWrapper<T, R>> {
    const existingRecordingSessionWrapper = this.getRunningRecordingSessionWrapper(tabId);
    if (existingRecordingSessionWrapper) {
      return existingRecordingSessionWrapper;
    }

    const recordingSessionWrapper = new RecordingSessionWrapper<T, R>(
      this.recordingSessionType,
      tabId,
    );
    this.recordingSessionWrappers.push(recordingSessionWrapper);
    await recordingSessionWrapper.start();
    return recordingSessionWrapper;
  }

  public async startRecordingSession(tabId: number): Promise<void> {
    const recordingSessionWrapper = await this.getOrCreateStartedRecordingSessionWrapper(tabId);
    const recordingWrapper = await recordingSessionWrapper.record();
    this.recordingWrappers.push(recordingWrapper);
  }

  public async stopRecordingSessions(tabId: number): Promise<void> {
    const startedRecordingSessionWrappers = this.recordingSessionWrappers.filter(
      (r) => r.state === 'started' && r.tabId === tabId,
    );
    await Promise.all(startedRecordingSessionWrappers.map((r) => r.stop()));
  }

  private getRecordingWrapper(recordingMetadata: RecordingMetadata): RecordingWrapper<R> {
    const recordingWrapper = this.recordingWrappers.find((r) => r.id === recordingMetadata.id);
    if (!recordingWrapper) {
      throw new Error(`Recording with id ${recordingMetadata.id} not found`);
    }
    return recordingWrapper;
  }

  public async stopRecording(recordingMetadata: RecordingMetadata): Promise<void> {
    console.debug(`[Recorder] stop recording ${recordingMetadata.id}`);
    const recordingWrapper = this.getRecordingWrapper(recordingMetadata);
    await recordingWrapper.stop();
    await this.stopRecordingSessions(recordingMetadata.tabId);
  }

  public async removeRecording(recordingMetadata: RecordingMetadata): Promise<void> {
    console.debug(`[Recorder] remove recording ${recordingMetadata.id}`);

    const recordingWrapperIndex = this.recordingWrappers.findIndex(
      (r) => r.id === recordingMetadata.id,
    );
    const recordingWrapper = this.recordingWrappers[recordingWrapperIndex];
    if (!recordingWrapper) {
      throw new Error(`Recording with id ${recordingMetadata.id} not found`);
    }

    recordingWrapper.clear();
    this.recordingWrappers.slice(recordingWrapperIndex, 1);

    await this.recordingRemovedPubSub.emit(recordingMetadata);
  }

  public async registerTitleChange(tabId: number, title: string, url: string): Promise<void> {
    const recordingSessionWrapper = this.getRunningRecordingSessionWrapper(tabId);
    if (!recordingSessionWrapper) {
      console.debug(
        `[Recorder] Not registering title change: No recording session found for tabId ${tabId}`,
      );
      return;
    }

    const recordingWrapper = await recordingSessionWrapper.record(title, url);
    this.recordingWrappers.push(recordingWrapper);
  }
}
