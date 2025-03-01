import { Recording } from './Recording';
import { RecordingWrapper } from './RecordingWrapper';

export interface RecordingSession<T extends Recording> {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  record: (title: string, url: string) => Promise<RecordingWrapper<T>>;
}
