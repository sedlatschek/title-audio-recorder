import browser from 'webextension-polyfill';
import {
  EnrichedTabTitleChangeMessageTab,
  isDiscoverOptionsTabMessage,
  isDownloadRecordingMessage,
  isGetRecordingsMessage,
  isRecordingAddedMessage,
  isRecordingBlobAddedMessage,
  isRecordingRemovedMessage,
  isRecordingUpdatedMessage,
  isRemoveRecordingMessage,
  isStartRecordingMessage,
  isStopRecordingMessage,
  isTabTitleChangedMessage,
  Message,
  MessageType,
  StartRecordingMessagePayload,
} from './Message';
import { PubSub } from './PubSub';
import { RecordingBlobAdded } from './RecordingBlobAdded';
import { RecordingMetadata } from './RecordingMetadata';

export class MessageBus {
  private readonly discoverOptionsTabPubSub = new PubSub<void, number>();
  private readonly getRecordingsPubSub = new PubSub<void, RecordingMetadata[]>();
  private readonly startRecordingPubSub = new PubSub<StartRecordingMessagePayload, void>();
  private readonly stopRecordingPubSub = new PubSub<RecordingMetadata, void>();
  private readonly downloadRecordingPubSub = new PubSub<RecordingMetadata, void>();
  private readonly removeRecordingPubSub = new PubSub<RecordingMetadata, void>();
  private readonly recordingAddedPubSub = new PubSub<RecordingMetadata, void>();
  private readonly recordingUpdatedPubSub = new PubSub<RecordingMetadata, void>();
  private readonly recordingBlobAddedPubSub = new PubSub<RecordingBlobAdded, void>();
  private readonly recordingRemovedPubSub = new PubSub<RecordingMetadata, void>();
  private readonly tabTitleChangedPubSub = new PubSub<EnrichedTabTitleChangeMessageTab, void>();

  constructor(private readonly location: string) {
    console.debug(`[${this.location} MessageBus] initialized`);
    browser.runtime.onMessage.addListener(this.handleRuntimeMessage.bind(this));
  }

  private handleRuntimeMessage(
    message: unknown,
    sender: browser.Runtime.MessageSender,
    sendResponse?: (message: unknown) => void,
  ): true | Promise<unknown> | undefined {
    console.debug(`<< [${this.location} MessageBus]`, message);

    if (isDiscoverOptionsTabMessage(message)) {
      return this.respond(this.discoverOptionsTabPubSub.emit(), sendResponse);
    } else if (isGetRecordingsMessage(message)) {
      return this.respond(this.getRecordingsPubSub.emit(), sendResponse);
    } else if (isStartRecordingMessage(message)) {
      this.startRecordingPubSub.emit(message);
    } else if (isStopRecordingMessage(message)) {
      this.stopRecordingPubSub.emit(message.recording);
    } else if (isDownloadRecordingMessage(message)) {
      this.downloadRecordingPubSub.emit(message.recording);
    } else if (isRemoveRecordingMessage(message)) {
      this.removeRecordingPubSub.emit(message.recording);
    } else if (isRecordingAddedMessage(message)) {
      this.recordingAddedPubSub.emit(message.recording);
    } else if (isRecordingUpdatedMessage(message)) {
      this.recordingUpdatedPubSub.emit(message.recording);
    } else if (isRecordingBlobAddedMessage(message)) {
      this.recordingBlobAddedPubSub.emit(message);
    } else if (isRecordingRemovedMessage(message)) {
      this.recordingRemovedPubSub.emit(message.recording);
    } else if (isTabTitleChangedMessage(message)) {
      if (sender.tab?.id === undefined) {
        throw new Error(
          `[${this.location} MessageBus] received TabTitleChangedMessage without tabId: ${JSON.stringify(message)}`,
        );
      }
      this.tabTitleChangedPubSub.emit({
        tabId: sender.tab.id,
        ...message.tab,
      });
    } else {
      throw new Error(
        `[${this.location} MessageBus] received unknown message: ${JSON.stringify(message)}`,
      );
    }
  }

  private respond(promise: Promise<unknown>, sendResponse?: (message: unknown) => void): true {
    if (!sendResponse) {
      throw new Error(`[${this.location} MessageBus] sendResponse is not defined`);
    }

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

  public onStartRecording(
    callback: (payload: StartRecordingMessagePayload) => Promise<void>,
  ): void {
    this.startRecordingPubSub.on(callback);
  }

  public async startRecording(tabId: number, numberRecordings: boolean): Promise<void> {
    const payload: StartRecordingMessagePayload = { tabId, numberRecordings };
    await this.request<StartRecordingMessagePayload, void>(this.startRecordingPubSub, payload, {
      messageType: MessageType.START_RECORDING,
      ...payload,
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

  public onDownloadRecording(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.downloadRecordingPubSub.on(callback);
  }

  public async downloadRecording(recording: RecordingMetadata): Promise<void> {
    await this.request<RecordingMetadata, void>(this.downloadRecordingPubSub, recording, {
      messageType: MessageType.DOWNLOAD_RECORDING,
      recording,
    });
  }

  public onRemoveRecording(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.removeRecordingPubSub.on(callback);
  }

  public async removeRecording(recording: RecordingMetadata): Promise<void> {
    await this.request<RecordingMetadata, void>(this.removeRecordingPubSub, recording, {
      messageType: MessageType.REMOVE_RECORDING,
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

  public async recordingBlobAdded(recordingBlobAdded: RecordingBlobAdded): Promise<void> {
    const { recording, recordingBlob } = recordingBlobAdded;
    await this.request<RecordingBlobAdded, void>(
      this.recordingBlobAddedPubSub,
      recordingBlobAdded,
      {
        messageType: MessageType.RECORDING_BLOB_ADDED,
        recording,
        recordingBlob,
      },
    );
  }

  public onRecordingDownloadAdded(
    callback: (downloadAdded: RecordingBlobAdded) => Promise<void>,
  ): void {
    this.recordingBlobAddedPubSub.on(callback);
  }

  public onRecordingRemoved(callback: (recording: RecordingMetadata) => Promise<void>): void {
    this.recordingRemovedPubSub.on(callback);
  }

  public async recordingRemoved(recording: RecordingMetadata): Promise<void> {
    await this.request<RecordingMetadata, void>(this.recordingRemovedPubSub, recording, {
      messageType: MessageType.RECORDING_REMOVED,
      recording,
    });
  }

  public onTabTitleChanged(
    callback: (event: EnrichedTabTitleChangeMessageTab) => Promise<void>,
  ): void {
    this.tabTitleChangedPubSub.on(callback);
  }

  public async tabTitleChanged(tab: EnrichedTabTitleChangeMessageTab): Promise<void> {
    await this.request<EnrichedTabTitleChangeMessageTab, void>(this.tabTitleChangedPubSub, tab, {
      messageType: MessageType.TAB_TITLE_CHANGED,
      tab,
    });
  }
}
