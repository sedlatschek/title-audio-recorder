import { EventArray } from '../../common/EventArray';
import { PubSub } from '../../common/PubSub';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { Recording } from './Recording';
import { RecordingSession } from './RecordingSession';
import { RecordingSessionWrapper } from './RecordingSessionWrapper';
import { RecordingWrapper } from './RecordingWrapper';

export class Recorder<T extends RecordingSession<R>, R extends Recording> {
  private recordingAddedPubSub = new PubSub<RecordingMetadata, void>();
  private recordingUpdatedPubSub = new PubSub<RecordingMetadata, void>();

  private recordingSessionWrappers: Record<number, RecordingSessionWrapper<T, R>> = [];
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
  }

  private async getRecordingSessionWrapper(tabId: number): Promise<RecordingSessionWrapper<T, R>> {
    const existingRecordingSessionWrapper = this.recordingSessionWrappers[tabId];
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

  public async startRecording(tabId: number): Promise<void> {
    const recordingSessionWrapper = await this.getRecordingSessionWrapper(tabId);
    const recordingWrapper = await recordingSessionWrapper.record();
    this.recordingWrappers.push(recordingWrapper);
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
  }

  public async registerTitleChange(tabId: number, title: string, url: string): Promise<void> {
    const recordingSessionWrapper = await this.getRecordingSessionWrapper(tabId);
    const recordingWrapper = await recordingSessionWrapper.record(title, url);
    this.recordingWrappers.push(recordingWrapper);
  }
}
