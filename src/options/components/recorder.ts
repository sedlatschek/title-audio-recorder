import { Recorder } from '../recorder/Recorder';
import { Recording } from '../recorder/Recording';
import { RecordingSession } from '../recorder/RecordingSession';
import { TabCaptureRecordingSession } from '../recorder/TabCaptureRecordingSession';

type RecorderType = Recorder<RecordingSession<Recording>, Recording>;

let recorder: RecorderType | undefined;

export function getRecorder(): RecorderType {
  if (recorder === undefined) {
    recorder = new Recorder(TabCaptureRecordingSession);
  }
  return recorder;
}
