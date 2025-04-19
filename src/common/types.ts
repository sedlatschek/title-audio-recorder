import { RecordingBlob } from './RecordingBlob';
import { RecordingMetadata } from './RecordingMetadata';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type RecordingBlobAdded = {
  recording: RecordingMetadata;
  recordingBlob: RecordingBlob;
};
