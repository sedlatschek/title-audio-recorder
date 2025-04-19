import { UUID } from './types';

export interface RecordingMetadata {
  readonly id: UUID;
  readonly tabId: number;
  readonly title: string;
  readonly pageUrl: string;
  readonly startedAtTs?: number;
  readonly stoppedAtTs?: number;
  readonly download: {
    available: boolean;
    count: number;
  };
}
