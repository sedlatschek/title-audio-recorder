import sanitize from 'sanitize-filename';
import browser from 'webextension-polyfill';
import { EventArray } from '../../common/EventArray';
import { getExtension } from '../../common/MimeType';
import { PubSub } from '../../common/PubSub';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';
import { getComponents } from '../components';
import { Recording } from './Recording';
import { RecordingBlob } from './RecordingBlob';

export class RecordingWrapper<T extends Recording> {
  private readonly recordingBlobs: EventArray<RecordingBlob> = new EventArray();
  private readonly startedPubSub = new PubSub<void, void>();
  private readonly stoppedPubSub = new PubSub<void, void>();
  private readonly updatedPubSub = new PubSub<void, void>();
  private readonly blobAddedPubSub = new PubSub<RecordingBlob, void>();

  public readonly id: UUID;
  private downloadCount = 0;

  public constructor(private readonly recording: T) {
    this.id = recording.id;

    this.recordingBlobs.onPush(async (recordingsBlobs: RecordingBlob[]): Promise<void> => {
      console.debug(`[RecordingWrapper]: recording ${this.id} has gained a blob`);
      await Promise.all([
        this.updatedPubSub.emit(),
        ...recordingsBlobs.map((blob) => this.blobAddedPubSub.emit(blob)),
      ]);
    });

    this.onStopped(async () => {
      if (!this.recording.recordingBlob) {
        throw Error('Recording blob is not available after it stopped');
      }

      this.recordingBlobs.push(this.recording.recordingBlob);

      const { converter } = getComponents();

      const blobs = await Promise.all(
        this.recordingBlobs.map((blob) => converter.convert(blob.blob)),
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

  public onBlobAdded(callback: (recordingBlob: RecordingBlob) => Promise<void>): void {
    this.blobAddedPubSub.on(callback);
  }

  public async start(): Promise<void> {
    await this.recording.start();
    this.startedPubSub.emit();
  }

  public async stop(): Promise<void> {
    await this.recording.stop();
    this.stoppedPubSub.emit();
  }

  public async download(): Promise<void> {
    const { configurationHandler } = getComponents();
    const { downloadMimeTypes } = await configurationHandler.getSettings();

    await Promise.all(
      this.recordingBlobs
        .filter((recordingBlob) => downloadMimeTypes.includes(recordingBlob.mimeType))
        .map(async (recordingBlob) => {
          this.downloadCount++;
          await browser.downloads.download({
            url: recordingBlob.url,
            filename: `${sanitize(this.recording.getRecordingMetadata().title)}.${getExtension(recordingBlob.mimeType)}`,
          });
          await this.updatedPubSub.emit();
        }),
    );
  }

  public clear(): void {
    for (const blob of this.recordingBlobs) {
      blob.revoke();
    }
    this.recordingBlobs.length = 0;
  }

  public async getRecordingMetadata(): Promise<RecordingMetadata> {
    const { configurationHandler } = getComponents();
    const { downloadMimeTypes } = await configurationHandler.getSettings();
    return {
      ...this.recording.getRecordingMetadata(),
      download: {
        available: this.recordingBlobs.some((blob) => downloadMimeTypes.includes(blob.mimeType)),
        count: this.downloadCount,
      },
    };
  }
}
