import { RecordingBlob } from '../options/recorder/RecordingBlob';
import { RecordingMetadata } from './RecordingMetadata';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type RecordingBlobAdded = {
  recording: RecordingMetadata;
  recordingBlob: RecordingBlob;
};
