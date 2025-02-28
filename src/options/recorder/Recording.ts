import { RecordingMetadata } from '../../common/RecordingMetadata';
import { UUID } from '../../common/types';

export interface Recording {
  readonly id: UUID;
  readonly state: RecordingState;
  start(): Promise<void>;
  stop(): Promise<void>;
  download(): void;
  getRecordingMetadata(): RecordingMetadata;
}
