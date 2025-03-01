import { RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';
import { Recording } from './Recording';

export type RecordingEventType = 'started' | 'stopped';

export type RecordingEventSubscription = {
  eventType: RecordingEventType;
  callback: () => void;
};

export class RecordingWrapper<T extends Recording> {
  private readonly subscriptions: RecordingEventSubscription[];
  public readonly id: UUID;

  public constructor(private readonly recording: T) {
    this.id = recording.id;
    this.subscriptions = [];
  }

  public async start(): Promise<void> {
    await this.recording.start();
    this.dispatch('started');
  }

  public async stop(): Promise<void> {
    await this.recording.stop();
    this.dispatch('stopped');
  }

  public download(): void {
    return this.recording.download();
  }

  public getRecordingMetadata(): RecordingMetadata {
    return this.recording.getRecordingMetadata();
  }

  public on(eventType: RecordingEventType, callback: () => void): void {
    const subscription: RecordingEventSubscription = { eventType, callback };
    this.subscriptions.push(subscription);
  }

  private dispatch(eventType: RecordingEventType): void {
    const subscriptions = this.subscriptions.filter(
      (s) => s.eventType === eventType,
    );
    for (const { callback } of subscriptions) {
      callback();
    }
  }
}
