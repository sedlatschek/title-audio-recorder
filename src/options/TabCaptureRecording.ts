import { DateTime } from "luxon";
import browser from "webextension-polyfill";
import { RecordingMetadata } from "../common/RecordingMetadata";
import { UUID } from "../common/types";
import { Message, MessageType } from "../common/Message";
import filenamify from "filenamify";

export class TabCaptureRecording {
  private mediaRecorder: MediaRecorder | undefined;
  private chunks: BlobPart[] = [];
  private startedAt?: DateTime;
  private stoppedAt?: DateTime;
  private blobUrl: string | undefined;

  public constructor(public readonly id: UUID, public readonly title: string) {
    this.sendMessage(MessageType.RECORDING_ADDED);
  }

  private async getStream(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      const captureOptions: chrome.tabCapture.CaptureOptions = {
        audio: true,
        video: false
      };

      chrome.tabCapture.capture(captureOptions, stream => {
        if (chrome.runtime.lastError || !stream) {
          reject(chrome.runtime.lastError)
          return;
        }
        resolve(stream);
      });
    })
  }

  public async start(): Promise<void> {
    if (this.startedAt) {
      throw new Error("Can not start recording: Recording already started");
    }
    if (this.stoppedAt) {
      throw new Error("Can not start recording: Recording already finished")
    }
    this.startedAt = DateTime.now();

    const stream = await this.getStream();
    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    mediaStreamSource.connect(audioContext.destination);

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm"
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.chunks, { type: "audio/webm" });
      this.blobUrl = URL.createObjectURL(audioBlob);
      this.chunks = [];
      this.mediaRecorder = undefined;
    }

    this.mediaRecorder.start();

    this.sendMessage(MessageType.RECORDING_STARTED);
  }

  public stop(): Promise<void> {
    if (this.stoppedAt) {
      throw new Error("Can not stop recording: Recording already stopped")
    }
    if (!this.mediaRecorder || !this.startedAt) {
      throw new Error("Can not stop recording: Recording was not running");
    }
    this.stoppedAt = DateTime.now();

    this.mediaRecorder.stop();

    this.sendMessage(MessageType.RECORDING_STOPPED);

    return Promise.resolve();
  }

  public download(): void {
    if (!this.blobUrl) {
      throw new Error('Recording without blobUrl can not be downloaded');
    }
    browser.downloads.download({
      url: this.blobUrl,
      filename: `${filenamify(this.title)}.webm`,
    });
  }

  private sendMessage(messageType: MessageType.RECORDING_ADDED |  MessageType.RECORDING_STARTED | MessageType.RECORDING_STOPPED) {
    const message: Message = {
      messageType,
      recording: this.getRecordingMetadata(),
    }
    browser.runtime.sendMessage(message);
  }

  public getRecordingMetadata(): RecordingMetadata {
    return {
      id: this.id,
      title: this.title,
      ...(this.startedAt !== undefined && { startedAtTs: this.startedAt.toMillis() }),
      ...(this.stoppedAt !== undefined && { stoppedAtTs: this.stoppedAt.toMillis() }),
    }
  }
}
