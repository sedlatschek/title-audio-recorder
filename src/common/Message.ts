import { RecordingMetadata } from './RecordingMetadata';

export enum MessageType {
  DISCOVER_OPTIONS_TAB = 'DISCOVER_OPTIONS_TAB',
  GET_RECORDINGS = 'GET_RECORDINGS',
  START_RECORDING = 'START_RECORDING',
  STOP_RECORDING = 'STOP_RECORDING',
  RECORDING_ADDED = 'RECORDING_ADDED',
  RECORDING_UPDATED = 'RECORDING_UPDATED',
  TAB_TITLE_CHANGED = 'TAB_TITLE_CHANGED',
}

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

export function isStartRecordingMessage(message: unknown): message is StartRecordingMessage {
  return isMessage(message) && message.messageType === MessageType.START_RECORDING;
}

export type StopRecordingMessage = {
  messageType: MessageType.STOP_RECORDING;
  recording: RecordingMetadata;
};

export function isStopRecordingMessage(message: unknown): message is StopRecordingMessage {
  return isMessage(message) && message.messageType === MessageType.STOP_RECORDING;
}

export type RecordingAddedMessage = {
  messageType: MessageType.RECORDING_ADDED;
  recording: RecordingMetadata;
};

export function isRecordingAddedMessage(message: unknown): message is RecordingAddedMessage {
  return isMessage(message) && message.messageType === MessageType.RECORDING_ADDED;
}

export type RecordingUpdatedMessage = {
  messageType: MessageType.RECORDING_UPDATED;
  recording: RecordingMetadata;
};

export function isRecordingUpdatedMessage(message: unknown): message is RecordingUpdatedMessage {
  return isMessage(message) && message.messageType === MessageType.RECORDING_UPDATED;
}

export type TabTitleChangedMessageTab = {
  title: string;
  url: string;
};

export type EnrichedTabTitleChangeMessageTab = TabTitleChangedMessageTab & {
  tabId: number;
};

export type TabTitleChangedMessage = {
  messageType: MessageType.TAB_TITLE_CHANGED;
  tab: TabTitleChangedMessageTab;
};

export function isTabTitleChangedMessage(message: unknown): message is TabTitleChangedMessage {
  return isMessage(message) && message.messageType === MessageType.TAB_TITLE_CHANGED;
}

export type DiscoverOptionsTabMessage = {
  messageType: MessageType.DISCOVER_OPTIONS_TAB;
};

export function isDiscoverOptionsTabMessage(
  message: unknown,
): message is DiscoverOptionsTabMessage {
  return isMessage(message) && message.messageType === MessageType.DISCOVER_OPTIONS_TAB;
}

export type GetRecordingsMessage = {
  messageType: MessageType.GET_RECORDINGS;
};

export function isGetRecordingsMessage(message: unknown): message is GetRecordingsMessage {
  return isMessage(message) && message.messageType === MessageType.GET_RECORDINGS;
}

export type Message =
  | DiscoverOptionsTabMessage
  | GetRecordingsMessage
  | StartRecordingMessage
  | StopRecordingMessage
  | RecordingAddedMessage
  | RecordingUpdatedMessage
  | TabTitleChangedMessage;
