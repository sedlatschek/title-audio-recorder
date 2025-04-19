import { RecordingBlob } from './RecordingBlob';
import { RecordingMetadata } from './RecordingMetadata';

export type RecordingBlobAdded = {
  recording: RecordingMetadata;
  recordingBlob: RecordingBlob;
};
