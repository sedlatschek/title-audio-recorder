import { RecordingSession } from './RecordingSession';
import { RecordingWrapper } from './RecordingWrapper';
import { TabCaptureRecording } from './TabCaptureRecording';

export class TabCaptureRecordingSession implements RecordingSession<TabCaptureRecording>
{
  private stream: MediaStream | undefined;
  private lastRecording: RecordingWrapper<TabCaptureRecording> | undefined;

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

  async record(title: string, url: string): Promise<RecordingWrapper<TabCaptureRecording>> {
    if (!this.stream) {
      throw new Error('Can not create title: Stream is not running');
    }
    console.debug(`[TabCaptureRecordingSession] registering title: ${title}`);

    await this.ensureLastRecordingIsStopped();

    this.lastRecording = new RecordingWrapper(
      new TabCaptureRecording(this.stream, title, url),
    );
    this.lastRecording.start();

    return this.lastRecording;
  }

  private ensureLastRecordingIsStopped(): Promise<void>
  {
    if (!this.lastRecording || this.lastRecording.getRecordingMetadata().stoppedAtTs) {
      return Promise.resolve();;
    }
    console.debug('[TabCaptureRecordingSession] stop last recording', this.lastRecording);
    return this.lastRecording.stop();
  }
}
