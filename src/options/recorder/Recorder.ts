import { EventArray } from '../../common/EventArray';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { Recording } from './Recording';
import { RecordingSession } from './RecordingSession';
import { RecordingSessionWrapper } from './RecordingSessionWrapper';
import { RecordingWrapper } from './RecordingWrapper';

type RecorderEventType = 'recordingAdded' | 'recordingStarted' | 'recordingStopped';
type RecorderEventSubscription = {
  eventType: RecorderEventType;
  callback: (recording: RecordingMetadata) => void;
};

export class Recorder<T extends RecordingSession<R>, R extends Recording> {
  private subscriptions: RecorderEventSubscription[];
  private recordingSessionWrappers: Record<number, RecordingSessionWrapper<T, R>> = [];
  private recordingWrappers: EventArray<RecordingWrapper<R>>;

  public constructor(private readonly recordingSessionType: new (tabId: number) => T) {
    this.subscriptions = [];
    this.recordingWrappers = new EventArray<RecordingWrapper<R>>();

    this.recordingWrappers.on('push', (items: RecordingWrapper<R>[]): void => {
      for (const item of items) {
        this.initializeRecording(item);
      }
    });
  }

  on(eventType: RecorderEventType, callback: (recording: RecordingMetadata) => void): void {
    this.subscriptions.push({ eventType, callback });
  }

  private dispatch(eventType: RecorderEventType, recordingWrapper: RecordingWrapper<R>): void {
    const subscriptions = this.subscriptions.filter((s) => s.eventType === eventType);
    for (const { callback } of subscriptions) {
      callback(recordingWrapper.getRecordingMetadata());
    }
  }

  public getRecordingMetadatas(): RecordingMetadata[] {
    return Array.from(this.recordingWrappers.map((r) => r.getRecordingMetadata()));
  }

  private initializeRecording(recordingWrapper: RecordingWrapper<R>): void {
    this.dispatch('recordingAdded', recordingWrapper);
    recordingWrapper.on('started', () => {
      this.dispatch('recordingStarted', recordingWrapper);
    });
    recordingWrapper.on('stopped', () => {
      this.dispatch('recordingStopped', recordingWrapper);
    });
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

  public downloadRecording(recordingMetadata: RecordingMetadata): void {
    console.debug(`[Recorder] download recording ${recordingMetadata.id}`);
    const recordingWrapper = this.getRecordingWrapper(recordingMetadata);
    recordingWrapper.download();
  }

  public async registerTitleChange(tabId: number, title: string, url: string): Promise<void> {
    const recordingSessionWrapper = await this.getRecordingSessionWrapper(tabId);
    const recordingWrapper = await recordingSessionWrapper.record(title, url);
    this.recordingWrappers.push(recordingWrapper);
  }
}
