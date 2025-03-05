import { UUID } from './types';

export interface RecordingMetadata {
  readonly id: UUID;
  readonly tabId: number;
  readonly title: string;
  readonly url: string;
  readonly startedAtTs?: number;
  readonly stoppedAtTs?: number;
}
