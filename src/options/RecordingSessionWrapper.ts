import { Recording } from './Recording';
import { RecordingSession } from './RecordingSession';
import { RecordingWrapper } from './RecordingWrapper';

export class RecordingSessionWrapper<T extends RecordingSession<R>, R extends Recording>
{
  private recordingSession: T | undefined;

  public constructor(
    private readonly recordingSessionType: new(tabId: number) => T,
    private readonly tabId: number,
  ) {
  }

  public start(): Promise<void>
  {
    if (this.recordingSession) {
      throw new Error('Can not start session: Session is already running');
    }
    console.debug(`[RecordingSessionWrapper] started for tab ${this.tabId}`);

    this.recordingSession = new this.recordingSessionType(this.tabId);
    return this.recordingSession.start();
  }

  public stop(): Promise<void>
  {
    if (!this.recordingSession) {
      throw new Error('Can not stop session: Session was not running');
    }
    console.debug(`[RecordingSessionWrapper] stopped for tab ${this.tabId}`);

    return this.recordingSession.stop();
  }

  private async getTabTitle(): Promise<string>
  {
    const tab = await chrome.tabs.get(this.tabId);
    return tab.title ?? 'Unknown Title';
  }

  public async record(title?: string): Promise<RecordingWrapper<R>> {
    if (!this.recordingSession) {
      throw new Error('Can not record title: Session is not running');
    }
    console.debug(`[RecordingSessionWrapper] registering title "${title}"`);

    return this.recordingSession.record(title ?? await this.getTabTitle());
  }
}
