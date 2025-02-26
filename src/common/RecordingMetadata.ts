import { UUID } from './types';

export interface RecordingMetadata {
  readonly id: UUID;
  readonly title: string;
  readonly startedAtTs?: number;
  readonly stoppedAtTs?: number;
}
