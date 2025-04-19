import { RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';
import { RecordingBlob } from './RecordingBlob';

export type RecordingMetadataWithoutDownload = Omit<RecordingMetadata, 'download'>;

export interface Recording {
  readonly id: UUID;
  readonly state: RecordingState;
  readonly recordingBlob: RecordingBlob | undefined;
  start(): Promise<void>;
  stop(): Promise<void>;
  getRecordingMetadata(): RecordingMetadataWithoutDownload;
}
