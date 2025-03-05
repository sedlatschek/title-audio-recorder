import { PubSub } from '../../common/PubSub';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';
import { Recording } from './Recording';

export class RecordingWrapper<T extends Recording> {
  private readonly startedPubSub = new PubSub<void, void>();
  private readonly stoppedPubSub = new PubSub<void, void>();
  public readonly id: UUID;

  public constructor(private readonly recording: T) {
    this.id = recording.id;
  }

  public onStarted(callback: () => Promise<void>): void {
    this.startedPubSub.on(callback);
  }

  public onStopped(callback: () => Promise<void>): void {
    this.stoppedPubSub.on(callback);
  }

  public async start(): Promise<void> {
    await this.recording.start();
    this.startedPubSub.emit();
  }

  public async stop(): Promise<void> {
    await this.recording.stop();
    this.stoppedPubSub.emit();
  }

  public download(): void {
    return this.recording.download();
  }

  public getRecordingMetadata(): RecordingMetadata {
    return this.recording.getRecordingMetadata();
  }
}
