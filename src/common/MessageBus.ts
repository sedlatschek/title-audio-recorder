import browser from 'webextension-polyfill';
import {
  isDiscoverOptionsTabMessage,
  isDownloadRecordingMessage,
  isGetRecordingsMessage,
  isRecordingAddedMessage,
  isRecordingStartedMessage,
  isRecordingStoppedMessage,
  isStartRecordingMessage,
  isStopRecordingMessage,
  isTabTitleChangedMessage,
  MessageType,
} from './Message';
import { PubSub } from './PubSub';
import { RecordingMetadata } from './RecordingMetadata';

export class MessageBus {
  private readonly discoverOptionsTabPubSub = new PubSub<void, number>();
  private readonly getRecordingsPubSub = new PubSub<
    void,
    RecordingMetadata[]
  >();
  private readonly startRecordingPubSub = new PubSub<number, void>();
  private readonly stopRecordingPubSub = new PubSub<RecordingMetadata, void>();
  private readonly downloadRecordingPubSub = new PubSub<
    RecordingMetadata,
    void
  >();
  private readonly recordingAddedPubSub = new PubSub<RecordingMetadata, void>();
  private readonly recordingStartedPubSub = new PubSub<
    RecordingMetadata,
    void
  >();
  private readonly recordingStoppedPubSub = new PubSub<
    RecordingMetadata,
    void
  >();
  private readonly tabTitleChangedPubSub = new PubSub<
    { tabId: number; title: string; url: string },
    void
  >();

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
    } else if (isDownloadRecordingMessage(message)) {
      this.downloadRecordingPubSub.emit(message.recording);
    } else if (isRecordingAddedMessage(message)) {
      this.recordingAddedPubSub.emit(message.recording);
    } else if (isRecordingStartedMessage(message)) {
      this.recordingStartedPubSub.emit(message.recording);
    } else if (isRecordingStoppedMessage(message)) {
      this.recordingStoppedPubSub.emit(message.recording);
    } else if (isTabTitleChangedMessage(message)) {
      const { tabId, title, url } = message;
      this.tabTitleChangedPubSub.emit({ tabId, title, url });
    } else {
      throw new Error(
        `[${this.location} MessageBus] received unknown message: ${JSON.stringify(message)}`,
      );
    }
  }

  private respond(
    promise: Promise<unknown>,
    sendResponse: (message: unknown) => void,
  ): true {
    promise
      .then((response) => {
        console.debug(`>> [${this.location} MessageBus] response`, response);
        sendResponse(response);
      })
      .catch((error) => {
        console.error(`>> [${this.location} MessageBus] error`, error);
        sendResponse(null);
      });
    return true;
  }

  public onDiscoverOptionsTab(callback: () => Promise<number>): void {
    this.discoverOptionsTabPubSub.on(callback);
  }

  public async discoverOptionsTab(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage({
          messageType: MessageType.DISCOVER_OPTIONS_TAB,
        })
        .then((messageResponse) => {
          if (typeof messageResponse !== 'number') {
            throw new Error(
              `[${this.location} MessageBus] received invalid discoverOptionsTab response: ${JSON.stringify(messageResponse)}`,
            );
          }
          this.discoverOptionsTabPubSub
            .emit()
            .then((busResponse) => {
              if (typeof busResponse !== 'number') {
                throw new Error(
                  `[${this.location} MessageBus] received invalid discoverOptionsTab response: ${JSON.stringify(busResponse)}`,
                );
              }
              resolve([busResponse, messageResponse]);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  public onGetRecordings(callback: () => Promise<RecordingMetadata[]>): void {
    this.getRecordingsPubSub.on(callback);
  }

  public async getRecordings(): Promise<RecordingMetadata[]> {
    return [
      ...(await this.getRecordingsPubSub.emit()),
      ...((await browser.runtime.sendMessage({
        messageType: MessageType.GET_RECORDINGS,
      })) as RecordingMetadata[][]),
    ].flat();
  }

  public onStartRecording(callback: (tabId: number) => Promise<void>): void {
    this.startRecordingPubSub.on(callback);
  }

  public startRecording(tabId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage({
          messageType: MessageType.START_RECORDING,
          tabId,
        })
        .then(() => {
          this.startRecordingPubSub.emit(tabId);
          resolve();
        })
        .catch(reject);
    });
  }

  public onStopRecording(
    callback: (recording: RecordingMetadata) => Promise<void>,
  ): void {
    this.stopRecordingPubSub.on(callback);
  }

  public stopRecording(recording: RecordingMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage({
          messageType: MessageType.STOP_RECORDING,
          recording,
        })
        .then(() => {
          this.stopRecordingPubSub.emit(recording);
          resolve();
        })
        .catch(reject);
    });
  }

  public onDownloadRecording(
    callback: (recording: RecordingMetadata) => Promise<void>,
  ): void {
    this.downloadRecordingPubSub.on(callback);
  }

  public async downloadRecording(recording: RecordingMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage({
          messageType: MessageType.DOWNLOAD_RECORDING,
          recording,
        })
        .then(() => {
          this.downloadRecordingPubSub.emit(recording);
          resolve();
        })
        .catch(reject);
    });
  }

  public onRecordingAdded(
    callback: (recording: RecordingMetadata) => Promise<void>,
  ): void {
    this.recordingAddedPubSub.on(callback);
  }

  public recordingAdded(recording: RecordingMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage({
          messageType: MessageType.RECORDING_ADDED,
          recording,
        })
        .then(() => {
          this.recordingAddedPubSub.emit(recording);
          resolve();
        })
        .catch(reject);
    });
  }

  public onRecordingStarted(
    callback: (recording: RecordingMetadata) => Promise<void>,
  ): void {
    this.recordingStartedPubSub.on(callback);
  }

  public recordingStarted(recording: RecordingMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage({
          messageType: MessageType.RECORDING_STARTED,
          recording,
        })
        .then(() => {
          this.recordingStartedPubSub.emit(recording);
          resolve();
        })
        .catch(reject);
    });
  }

  public onRecordingStopped(
    callback: (recording: RecordingMetadata) => Promise<void>,
  ): void {
    this.recordingStoppedPubSub.on(callback);
  }

  public recordingStopped(recording: RecordingMetadata): Promise<void> {
    return new Promise((resolve, reject) => {
      browser.runtime
        .sendMessage({
          messageType: MessageType.RECORDING_STOPPED,
          recording,
        })
        .then(() => {
          this.recordingStoppedPubSub.emit(recording);
          resolve();
        })
        .catch(reject);
    });
  }

  public onTabTitleChanged(
    callback: (event: {
      tabId: number;
      title: string;
      url: string;
    }) => Promise<void>,
  ): void {
    this.tabTitleChangedPubSub.on(callback);
  }

  public tabTitleChanged(
    tabId: number,
    title: string,
    url: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const event = { tabId, title, url };
      browser.runtime
        .sendMessage({
          messageType: MessageType.TAB_TITLE_CHANGED,
          ...event,
        })
        .then(() => {
          this.tabTitleChangedPubSub.emit(event);
          resolve();
        })
        .catch(reject);
    });
  }
}
