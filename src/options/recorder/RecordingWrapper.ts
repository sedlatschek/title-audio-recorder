import { EventArray } from '../../common/EventArray';
import { getExtension } from '../../common/MimeType';
import { PubSub } from '../../common/PubSub';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';
import { getConverter } from '../components/converter';
import { getSettings } from '../components/settings';
import { Recording } from './Recording';
import { RecordingBlob } from './RecordingBlob';

export class RecordingWrapper<T extends Recording> {
  private readonly recordingBlobs: EventArray<RecordingBlob> = new EventArray();
  private readonly startedPubSub = new PubSub<void, void>();
  private readonly stoppedPubSub = new PubSub<void, void>();
  private readonly updatedPubSub = new PubSub<void, void>();
  public readonly id: UUID;

  public constructor(private readonly recording: T) {
    this.id = recording.id;

    this.recordingBlobs.on('push', () => {
      console.debug(`[RecordingWrapper]: recording ${this.id} gained a blob`);
      this.updatedPubSub.emit();
    });

    this.onStopped(async () => {
      if (!this.recording.recordingBlob) {
        throw Error('Recording blob is not available after it stopped');
      }

      // add original blob
      this.recordingBlobs.push(this.recording.recordingBlob);

      // convert to every available format and also add resulting blobs
      const blobs = await Promise.all(
        this.recordingBlobs.map((blob) => getConverter().convert(blob.blob)),
      );
      this.recordingBlobs.push(...blobs.flat().map((blob) => new RecordingBlob(blob)));
    });
  }

  public onStarted(callback: () => Promise<void>): void {
    this.startedPubSub.on(callback);
  }

  public onStopped(callback: () => Promise<void>): void {
    this.stoppedPubSub.on(callback);
  }

  public onUpdated(callback: () => Promise<void>): void {
    this.updatedPubSub.on(callback);
  }

  public async start(): Promise<void> {
    await this.recording.start();
    this.startedPubSub.emit();
  }

  public async stop(): Promise<void> {
    await this.recording.stop();
    this.stoppedPubSub.emit();
  }

  public getRecordingMetadata(): RecordingMetadata {
    const settings = getSettings().get();
    return {
      ...this.recording.getRecordingMetadata(),
      downloads: Array.from(
        this.recordingBlobs
          .filter((blob) => settings.mimeTypes.includes(blob.mimeType))
          .map((blob) => ({
            mimeType: blob.mimeType,
            url: blob.url,
            extension: getExtension(blob.mimeType),
          })),
      ),
    };
  }
}
