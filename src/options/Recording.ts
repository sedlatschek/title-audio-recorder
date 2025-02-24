import { RecordingMetadata } from '../common/RecordingMetadata';
import { UUID } from '../common/types';

export interface Recording {
  readonly id: UUID;
  readonly title: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  download(): void;
  getRecordingMetadata(): RecordingMetadata;
}
