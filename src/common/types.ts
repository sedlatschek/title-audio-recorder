import { RecordingDownload, RecordingMetadata } from './RecordingMetadata';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type RecordingDownloadAdded = {
  recording: RecordingMetadata;
  recordingDownload: RecordingDownload;
};
