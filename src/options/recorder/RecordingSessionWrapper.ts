import { Recording } from './Recording';
import { RecordingSession } from './RecordingSession';
import { RecordingState } from './RecordingState';
import { RecordingWrapper } from './RecordingWrapper';

export class RecordingSessionWrapper<T extends RecordingSession<R>, R extends Recording> {
  private recordingState: RecordingState = 'idle';
  private recordingSession: T | undefined;
  private recordingNumber: number = 0;

  public constructor(
    private readonly recordingSessionType: new (tabId: number) => T,
    public readonly tabId: number,
    private readonly numberRecordings: boolean,
  ) {}

  public get state(): RecordingState {
    return this.recordingState;
  }

  public async start(): Promise<void> {
    if (this.recordingState === 'started') {
      throw new Error('Can not start session: Session is already running');
    }
    console.debug(`[RecordingSessionWrapper] started for tab ${this.tabId}`);

    this.recordingSession = new this.recordingSessionType(this.tabId);
    await this.recordingSession.start();
    this.recordingState = 'started';
  }

  public async stop(): Promise<void> {
    if (this.recordingState !== 'started' || !this.recordingSession) {
      throw new Error('Can not stop session: Session was not running');
    }
    console.debug(`[RecordingSessionWrapper] stopped for tab ${this.tabId}`);

    await this.recordingSession.stop();
    this.recordingState = 'stopped';
  }

  private async getTabTitle(): Promise<string> {
    const tab = await chrome.tabs.get(this.tabId);
    return tab.title ?? 'Unknown Title';
  }

  private async getTabUrl(): Promise<string> {
    const tab = await chrome.tabs.get(this.tabId);
    return tab.url ?? 'Unknown URL';
  }

  public async record(title?: string, url?: string): Promise<RecordingWrapper<R>> {
    if (!this.recordingSession) {
      throw new Error('Can not record title: Session is not running');
    }
    console.debug(`[RecordingSessionWrapper] registering title "${title}"`);

    const recordingTitle = title ?? (await this.getTabTitle());

    const numberedTitle = this.numberRecordings
      ? `${(++this.recordingNumber).toString().padStart(2, '0')} - ${recordingTitle}`
      : recordingTitle;

    return this.recordingSession.record(numberedTitle, url ?? (await this.getTabUrl()));
  }
}
