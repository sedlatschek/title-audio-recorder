import { DateTime } from 'luxon';
import pRetry from 'p-retry';
import { UUID } from '../../common/types';
import { Recording, RecordingMetadataWithoutDownload } from './Recording';
import { RecordingBlob } from './RecordingBlob';

export class TabCaptureRecording implements Recording {
  private mediaRecorder: MediaRecorder | undefined;
  private chunks: BlobPart[] = [];
  private startedAt?: DateTime;
  private stoppedAt?: DateTime;
  public blob: RecordingBlob | undefined;
  public readonly id: UUID;

  public constructor(
    private readonly tabId: number,
    private readonly stream: MediaStream,
    private readonly title: string,
    private readonly url: string,
  ) {
    this.id = self.crypto.randomUUID();
  }

  public get state(): RecordingState {
    return this.mediaRecorder?.state ?? 'inactive';
  }

  public get recordingBlob(): RecordingBlob | undefined {
    return this.blob;
  }

  public async start(): Promise<void> {
    if (this.startedAt) {
      throw new Error('Can not start recording: Recording already started');
    }
    if (this.stoppedAt) {
      throw new Error('Can not start recording: Recording already finished');
    }
    this.startedAt = DateTime.now();

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm',
    });

    this.mediaRecorder.ondataavailable = (event): void => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = (): void => {
      const audioBlob = new Blob(this.chunks, { type: 'audio/webm' });
      this.blob = new RecordingBlob(audioBlob);
      this.chunks = [];
      this.mediaRecorder = undefined;
    };

    this.mediaRecorder.start();
  }

  public async stop(): Promise<void> {
    if (this.stoppedAt) {
      throw new Error('Can not stop recording: Recording already stopped');
    }
    if (!this.mediaRecorder || !this.startedAt) {
      throw new Error('Can not stop recording: Recording was not running');
    }
    this.stoppedAt = DateTime.now();

    this.mediaRecorder.stop();

    await pRetry(
      () => {
        if (this.mediaRecorder !== undefined) {
          throw new Error('MediaRecorder did not stop');
        }
      },
      {
        retries: 100,
        maxTimeout: 10,
        minTimeout: 10,
      },
    );
  }

  public getRecordingMetadata(): RecordingMetadataWithoutDownload {
    return {
      id: this.id,
      tabId: this.tabId,
      title: this.title,
      pageUrl: this.url,
      ...(this.startedAt !== undefined && {
        startedAtTs: this.startedAt.toMillis(),
      }),
      ...(this.stoppedAt !== undefined && {
        stoppedAtTs: this.stoppedAt.toMillis(),
      }),
    };
  }
}
