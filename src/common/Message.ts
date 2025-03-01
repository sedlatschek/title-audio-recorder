import { RecordingMetadata } from './RecordingMetadata';

export enum MessageType {
  START_RECORDING = 'START_RECORDING',
  STOP_RECORDING = 'STOP_RECORDING',
  RECORDING_ADDED = 'RECORDING_ADDED',
  RECORDING_STARTED = 'RECORDING_STARTED',
  RECORDING_STOPPED = 'RECORDING_STOPPED',
  DOWNLOAD_RECORDING = 'DOWNLOAD_RECORDING',
  TAB_TITLE_CHANGED = 'TAB_TITLE_CHANGED',
}

type MessageBase = {
  dispatched?: true;
  tabId?: number;
};

export function isMessage(message: unknown): message is Message {
  return (
    message != null &&
    typeof message === 'object' &&
    'messageType' in message &&
    Object.values(MessageType).includes(message.messageType as MessageType)
  );
}

export type StartRecordingMessage = {
  messageType: MessageType.START_RECORDING;
  tabId: number;
};

export function isStartRecordingMessage(
  message: unknown,
): message is StartRecordingMessage {
  return (
    isMessage(message) && message.messageType === MessageType.START_RECORDING
  );
}

export type StopRecordingMessage = {
  messageType: MessageType.STOP_RECORDING;
  recording: RecordingMetadata;
};

export function isStopRecordingMessage(
  message: unknown,
): message is StopRecordingMessage {
  return (
    isMessage(message) && message.messageType === MessageType.STOP_RECORDING
  );
}

export type RecordingAddedMessage = {
  messageType: MessageType.RECORDING_ADDED;
  recording: RecordingMetadata;
};

export function isRecordingAddedMessage(
  message: unknown,
): message is RecordingAddedMessage {
  return (
    isMessage(message) && message.messageType === MessageType.RECORDING_ADDED
  );
}

export type RecordingStartedMessage = {
  messageType: MessageType.RECORDING_STARTED;
  recording: RecordingMetadata;
};

export function isRecordingStartedMessage(
  message: unknown,
): message is RecordingStartedMessage {
  return (
    isMessage(message) && message.messageType === MessageType.RECORDING_STARTED
  );
}

export type RecordingStoppedMessage = {
  messageType: MessageType.RECORDING_STOPPED;
  recording: RecordingMetadata;
};

export function isRecordingStoppedMessage(
  message: unknown,
): message is RecordingStoppedMessage {
  return (
    isMessage(message) && message.messageType === MessageType.RECORDING_STOPPED
  );
}

export type DownloadRecordingMessage = {
  messageType: MessageType.DOWNLOAD_RECORDING;
  recording: RecordingMetadata;
};

export function isDownloadRecordingMessage(
  message: unknown,
): message is DownloadRecordingMessage {
  return (
    isMessage(message) && message.messageType === MessageType.DOWNLOAD_RECORDING
  );
}

export type TabTitleChangedMessage = {
  messageType: MessageType.TAB_TITLE_CHANGED;
  tabId: number;
  title: string;
  url: string;
};

export function isTabTitleChangedMessage(
  message: unknown,
): message is TabTitleChangedMessage {
  return (
    isMessage(message) && message.messageType === MessageType.TAB_TITLE_CHANGED
  );
}

export type Message = MessageBase &
  (
    | StartRecordingMessage
    | StopRecordingMessage
    | RecordingAddedMessage
    | RecordingStartedMessage
    | RecordingStoppedMessage
    | DownloadRecordingMessage
    | TabTitleChangedMessage
  );
