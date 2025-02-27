import { Recording } from './Recording';
import { RecordingStream } from './RecordingStream';
import { RecordingWrapper } from './RecordingWrapper';

export class RecordingSession<T extends RecordingStream<R>, R extends Recording>
{
  private stream: T | undefined;

  public constructor(
    private readonly recordingStreamType: new(tabId: number) => T,
    private readonly tabId: number,
  ) {
  }

  public start(): Promise<void>
  {
    if (this.stream) {
      throw new Error('Can not start session: Session is already running');
    }
    console.debug(`[RecordingSession] started for tab ${this.tabId}`);

    this.stream = new this.recordingStreamType(this.tabId);
    return this.stream.start();
  }

  public stop(): Promise<void>
  {
    if (!this.stream) {
      throw new Error('Can not stop session: Session was not running');
    }
    console.debug(`[RecordingSession] stopped for tab ${this.tabId}`);

    return this.stream.stop();
  }

  private async getTabTitle(): Promise<string>
  {
    const tab = await chrome.tabs.get(this.tabId);
    return tab.title ?? 'Unknown Title';
  }

  public async record(title?: string): Promise<RecordingWrapper<R>> {
    if (!this.stream) {
      throw new Error('Can not record title: Session is not running');
    }
    console.debug(`[RecordingSession] registering title "${title}"`);

    return this.stream.record(title ?? await this.getTabTitle());
  }
}
