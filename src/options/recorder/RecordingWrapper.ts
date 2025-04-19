import { EventArray } from '../../common/EventArray';
import { PubSub } from '../../common/PubSub';
import { RecordingDownload, RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';
import { getConfigurationHandler } from '../components/configurationHandler';
import { getConverter } from '../components/converter';
import { getDownloadFromBlob } from './mapper';
import { Recording } from './Recording';
import { RecordingBlob } from './RecordingBlob';

export class RecordingWrapper<T extends Recording> {
  private readonly recordingBlobs: EventArray<RecordingBlob> = new EventArray();
  private readonly startedPubSub = new PubSub<void, void>();
  private readonly stoppedPubSub = new PubSub<void, void>();
  private readonly updatedPubSub = new PubSub<void, void>();
  private readonly downloadAddedPubSub = new PubSub<RecordingDownload, void>();
  public readonly id: UUID;

  public constructor(private readonly recording: T) {
    this.id = recording.id;

    this.recordingBlobs.onPush(async (recordingsBlobs: RecordingBlob[]): Promise<void> => {
      console.debug(`[RecordingWrapper]: recording ${this.id} has gained a blob`);
      await Promise.all([
        this.updatedPubSub.emit(),
        ...recordingsBlobs.map((blob) => this.downloadAddedPubSub.emit(getDownloadFromBlob(blob))),
      ]);
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

  public onDownloadAdded(callback: (download: RecordingDownload) => Promise<void>): void {
    this.downloadAddedPubSub.on(callback);
  }

  public async start(): Promise<void> {
    await this.recording.start();
    this.startedPubSub.emit();
  }

  public async stop(): Promise<void> {
    await this.recording.stop();
    this.stoppedPubSub.emit();
  }

  public clear(): void {
    for (const blob of this.recordingBlobs) {
      blob.revoke();
    }
    this.recordingBlobs.length = 0;
  }

  public async getRecordingMetadata(): Promise<RecordingMetadata> {
    const { downloadMimeTypes } = await getConfigurationHandler().getSettings();
    return {
      ...this.recording.getRecordingMetadata(),
      downloads: Array.from(
        this.recordingBlobs
          .filter((recordingBlob) => downloadMimeTypes.includes(recordingBlob.mimeType))
          .map((recordingBlob) => getDownloadFromBlob(recordingBlob)),
      ),
    };
  }
}
