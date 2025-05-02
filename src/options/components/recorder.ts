import { Recorder } from '../recorder/Recorder';
import { Recording } from '../recorder/Recording';
import { RecordingSession } from '../recorder/RecordingSession';
import { TabCaptureRecordingSession } from '../recorder/TabCaptureRecordingSession';

export function createRecorder(): Recorder<RecordingSession<Recording>, Recording> {
  return new Recorder(TabCaptureRecordingSession);
}
