import browser from 'webextension-polyfill';
import {
  isDiscoverOptionsTabMessage,
  isGetRecordingsMessage,
  isRecordingAddedMessage,
  isRecordingUpdatedMessage,
  isStartRecordingMessage,
  isStopRecordingMessage,
  isTabTitleChangedMessage,
  Message,
  MessageType,
  TabTitleChangedMessageTab,
} from './Message';
import { PubSub } from './PubSub';
import { RecordingMetadata } from './RecordingMetadata';

export class MessageBus {
  private readonly discoverOptionsTabPubSub = new PubSub<void, number>();
  private readonly getRecordingsPubSub = new PubSub<void, RecordingMetadata[]>();
  private readonly startRecordingPubSub = new PubSub<number, void>();
  private readonly stopRecordingPubSub = new PubSub<RecordingMetadata, void>();
  private readonly recordingAddedPubSub = new PubSub<RecordingMetadata, void>();
  private readonly recordingUpdatedPubSub = new PubSub<RecordingMetadata, void>();
  private readonly tabTitleChangedPubSub = new PubSub<TabTitleChangedMessageTab, void>();

  constructor(private readonly location: string) {
    console.debug(`[${this.location} MessageBus] initialized`);
    browser.runtime.onMessage.addListener((message, sender, sendResponse) =>
      this.handleRuntimeMessage(message, sender, sendResponse),
    );
  }

  private handleRuntimeMessage(
    message: unknown,
    sender: browser.Runtime.MessageSender,
    sendResponse: (message: unknown) => void,
  ): true | Promise<unknown> | undefined {
    console.debug(`<< [${this.location} MessageBus]`, message);

    if (isDiscoverOptionsTabMessage(message)) {
      return this.respond(this.discoverOptionsTabPubSub.emit(), sendResponse);
    } else if (isGetRecordingsMessage(message)) {
      return this.respond(this.getRecordingsPubSub.emit(), sendResponse);
    } else if (isStartRecordingMessage(message)) {
      this.startRecordingPubSub.emit(message.tabId);
    } else if (isStopRecordingMessage(message)) {
      this.stopRecordingPubSub.emit(message.recording);
    } else if (isRecordingAddedMessage(message)) {
      this.recordingAddedPubSub.emit(message.recording);
    } else if (isRecordingUpdatedMessage(message)) {
      this.recordingUpdatedPubSub.emit(message.recording);
    } else if (isTabTitleChangedMessage(message)) {
      this.tabTitleChangedPubSub.emit(message.tab);
    } else {
      throw new Error(
        `[${this.location} MessageBus] received unknown message: ${JSON.stringify(message)}`,
      );
    }
  }

  private respond(promise: Promise<unknown>, sendResponse: (message: unknown) => void): true {
    promise
      .then((response) => {
        console.debug(`>> [${this.location} MessageBus] response`, response);
        sendResponse(response);
      })
      .catch((error) => {
        console.error(`>> [${this.location} MessageBus] error`, error);
        sendResponse(undefined);
      });
    return true;
  }

  private async request<EventType, ReturnType>(
    pubSub: PubSub<EventType, ReturnType>,
    argument: EventType,
    message: Message,
  ): Promise<ReturnType[]> {
    const [runtimeResponse, pubSubResponse] = await Promise.all([
      browser.runtime.sendMessage<Message, ReturnType[] | undefined>(message),
      pubSub.emit(argument),
    ]);

    return [...(runtimeResponse ?? []), ...pubSubResponse];
  }

  public onDiscoverOptionsTab(callback: () => Promise<number>): void {
    this.discoverOptionsTabPubSub.on(callback);
  }

  public discoverOptionsTab(): Promise<number[]> {
    return this.request<void, number>(this.discoverOptionsTabPubSub, undefined, {
      messageType: MessageType.DISCOVER_OPTIONS_TAB,
    });
  }

  public onGetRecordings(callback: () => Promise<RecordingMetadata[]>): void {
    this.getRecordingsPubSub.on(callback);
  }

  public async getRecordings(): Promise<RecordingMetadata[]> {
    const recordings = await this.request<void, RecordingMetadata[]>(
      this.getRecordingsPubSub,
      undefined,
      {
        messageType: MessageType.GET_RECORDINGS,
      },
    );
    return recordings.flat();
  }

  public onStartRecording(callback: (tabId: number) => Promise<void>): void {
    this.startRecordingPubSub.on(callback);
  }

  public async startRecording(tabId: number): Promise<void> {
    await this.request<number, void>(this.startRecordingPubSub, tabId, {
      messageType: MessageType.START_RECORDING,
      tabId,
    });
  }

  public onStopRecording(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.stopRecordingPubSub.on(callback);
  }

  public async stopRecording(recording: RecordingMetadata): Promise<void> {
    await this.request<RecordingMetadata, void>(this.stopRecordingPubSub, recording, {
      messageType: MessageType.STOP_RECORDING,
      recording,
    });
  }

  public onRecordingAdded(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.recordingAddedPubSub.on(callback);
  }

  public async recordingAdded(recording: RecordingMetadata): Promise<void> {
    await this.request<RecordingMetadata, void>(this.recordingAddedPubSub, recording, {
      messageType: MessageType.RECORDING_ADDED,
      recording,
    });
  }

  public onRecordingUpdated(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.recordingUpdatedPubSub.on(callback);
  }

  public async recordingUpdated(recording: RecordingMetadata): Promise<void> {
    await this.request<RecordingMetadata, void>(this.recordingUpdatedPubSub, recording, {
      messageType: MessageType.RECORDING_UPDATED,
      recording,
    });
  }

  public onTabTitleChanged(
    callback: (event: { tabId: number; title: string; url: string }) => Promise<void>,
  ): void {
    this.tabTitleChangedPubSub.on(callback);
  }

  public async tabTitleChanged(tab: TabTitleChangedMessageTab): Promise<void> {
    await this.request<TabTitleChangedMessageTab, void>(this.tabTitleChangedPubSub, tab, {
      messageType: MessageType.TAB_TITLE_CHANGED,
      tab,
    });
  }
}
