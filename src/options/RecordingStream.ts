import { Recording } from './Recording';
import { RecordingWrapper } from './RecordingWrapper';

export interface RecordingStream<T extends Recording> {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  record: (title: string) => Promise<RecordingWrapper<T>>;
}
