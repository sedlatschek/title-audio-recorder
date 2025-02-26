import { Recording } from './Recording';
import { RecordingStream } from './RecordingStream';
import { TabCaptureRecording } from './TabCaptureRecording';

export class TabCaptureRecordingStream implements RecordingStream
{
  private stream: MediaStream | undefined;
  private lastRecording: TabCaptureRecording | undefined;

  private async tabCapture(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      const captureOptions: chrome.tabCapture.CaptureOptions = {
        audio: true,
        video: false,
      };

      chrome.tabCapture.capture(captureOptions, stream => {
        if (chrome.runtime.lastError || !stream) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(stream);
      });
    });
  }

  async start(): Promise<void> {
    if (this.stream) {
      throw new Error('Can not start recording stream: Stream already running');
    }

    this.stream = await this.tabCapture();
    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(this.stream);
    mediaStreamSource.connect(audioContext.destination);
  }

  async stop(): Promise<void> {
    if (!this.stream) {
      throw new Error('Can not stop recording stream: Stream is not running');
    }

    await this.ensureLastRecordingIsStopped();
    await Promise.allSettled(this.stream.getTracks().map((track) => track.stop()));
  }

  async record(title: string): Promise<Recording> {
    if (!this.stream) {
      throw new Error('Can not create title: Stream is not running');
    }
    console.debug(`[TabCaptureRecordingStream] registering title: ${title}`);

    await this.ensureLastRecordingIsStopped();

    this.lastRecording = new TabCaptureRecording(this.stream, title);
    this.lastRecording.start();

    return this.lastRecording;
  }

  private ensureLastRecordingIsStopped(): Promise<void>
  {
    if (!this.lastRecording || this.lastRecording.getRecordingMetadata().stoppedAtTs) {
      return Promise.resolve();;
    }
    console.debug('[TabCaptureRecordingStream] stop last recording', this.lastRecording);
    return this.lastRecording.stop();
  }
}
