import { RecordingMetadata } from './RecordingMetadata';

export enum MessageType {
  RECORD = 'RECORD',
  RECORDING_ADDED = 'RECORDING_ADDED',
  RECORDING_STARTED = 'RECORDING_STARTED',
  RECORDING_STOPPED = 'RECORDING_STOPPED',
  RECORDING_DOWNLOADED = 'RECORDING_DOWNLOADED',
  TAB_TITLE_CHANGE_DETECTED = 'TAB_TITLE_CHANGE_DETECTED',
  TAB_TITLE_CHANGED = 'TAB_TITLE_CHANGED',
}

type MessageBase = {
  dispatched?: true;
}

export function isMessage(message: unknown): message is Message {
  return message != null
    && typeof message === 'object'
    && 'messageType' in message
    && Object.values(MessageType).includes(message.messageType as MessageType);
}

export type RecordMessage = {
  messageType: MessageType.RECORD,
  tabId: number;
}

export function isRecordMessage(message: unknown): message is RecordMessage {
  return isMessage(message) && message.messageType === MessageType.RECORD;
}

export type RecordingAddedMessage = {
  messageType: MessageType.RECORDING_ADDED;
  recording: RecordingMetadata;
}

export function isRecordingAddedMessage(message: unknown): message is RecordingAddedMessage {
  return isMessage(message) && message.messageType === MessageType.RECORDING_ADDED;
}

export type RecordingStartedMessage = {
  messageType: MessageType.RECORDING_STARTED;
  recording: RecordingMetadata;
}

export function isRecordingStartedMessage(message: unknown): message is RecordingStartedMessage {
  return isMessage(message) && message.messageType === MessageType.RECORDING_STARTED;
}

export type RecordingStoppedMessage = {
  messageType: MessageType.RECORDING_STOPPED;
  recording: RecordingMetadata;
}

export function isRecordingStoppedMessage(message: unknown): message is RecordingStoppedMessage {
  return isMessage(message) && message.messageType === MessageType.RECORDING_STOPPED;
}

export type RecordingDownloadedMessage = {
  messageType: MessageType.RECORDING_DOWNLOADED;
  recording: RecordingMetadata;
}

export function isRecordingDownloadedMessage(message: unknown): message is RecordingDownloadedMessage {
  return isMessage(message) && message.messageType === MessageType.RECORDING_DOWNLOADED;
}

export type TabTitleChangeDetectedMessage = {
  messageType: MessageType.TAB_TITLE_CHANGED;
  title: string;
}

export function isTabTitleChangeDetectedMessage(message: unknown): message is TabTitleChangeDetectedMessage {
  return isMessage(message) && message.messageType === MessageType.TAB_TITLE_CHANGED;
}

export type TabTitleChangedMessage = {
  messageType: MessageType.TAB_TITLE_CHANGED;
  tabId: number;
  title: string;
}

export function isTabTitleChangedMessage(message: unknown): message is TabTitleChangedMessage {
  return isMessage(message) && message.messageType === MessageType.TAB_TITLE_CHANGED;
}

export type Message = MessageBase & (RecordMessage
  | RecordingAddedMessage
  | RecordingStartedMessage
  | RecordingStoppedMessage
  | RecordingDownloadedMessage
  | TabTitleChangedMessage);
