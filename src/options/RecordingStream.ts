import { Recording } from './Recording';

export interface RecordingStream {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  record: (title: string) => Promise<Recording>;
}
