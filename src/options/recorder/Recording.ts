import { RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';
import { RecordingBlob } from './RecordingBlob';

export type RecordingMetadataWithoutDownloads = Omit<RecordingMetadata, 'downloads'>;

export interface Recording {
  readonly id: UUID;
  readonly state: RecordingState;
  readonly recordingBlob: RecordingBlob | undefined;
  start(): Promise<void>;
  stop(): Promise<void>;
  getRecordingMetadata(): RecordingMetadataWithoutDownloads;
}
