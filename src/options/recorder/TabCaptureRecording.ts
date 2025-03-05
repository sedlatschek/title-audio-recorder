import filenamify from 'filenamify';
import { DateTime } from 'luxon';
import browser from 'webextension-polyfill';
import { RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';
import { Recording } from './Recording';

export class TabCaptureRecording implements Recording {
  private mediaRecorder: MediaRecorder | undefined;
  private chunks: BlobPart[] = [];
  private startedAt?: DateTime;
  private stoppedAt?: DateTime;
  private blobUrl: string | undefined;
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

  public async start(): Promise<void> {
    if (this.startedAt) {
      throw new Error('Can not start recording: Recording already started');
    }
    if (this.stoppedAt) {
      throw new Error('Can not start recording: Recording already finished');
    }
    this.startedAt = DateTime.now();

    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(this.stream);
    mediaStreamSource.connect(audioContext.destination);

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
      this.blobUrl = URL.createObjectURL(audioBlob);
      this.chunks = [];
      this.mediaRecorder = undefined;
    };

    this.mediaRecorder.start();
  }

  public stop(): Promise<void> {
    if (this.stoppedAt) {
      throw new Error('Can not stop recording: Recording already stopped');
    }
    if (!this.mediaRecorder || !this.startedAt) {
      throw new Error('Can not stop recording: Recording was not running');
    }
    this.stoppedAt = DateTime.now();

    this.mediaRecorder.stop();

    return Promise.resolve();
  }

  public download(): void {
    if (!this.blobUrl) {
      throw new Error('Recording without blobUrl can not be downloaded');
    }
    browser.downloads.download({
      url: this.blobUrl,
      filename: `${filenamify(this.title ?? this.id)}.webm`,
    });
  }

  public getRecordingMetadata(): RecordingMetadata {
    return {
      id: this.id,
      tabId: this.tabId,
      title: this.title,
      url: this.url,
      ...(this.startedAt !== undefined && {
        startedAtTs: this.startedAt.toMillis(),
      }),
      ...(this.stoppedAt !== undefined && {
        stoppedAtTs: this.stoppedAt.toMillis(),
      }),
    };
  }
}
