import { getExtension } from '../../common/MimeType';
import { RecordingDownload } from '../../common/RecordingMetadata';
import { RecordingBlob } from './RecordingBlob';

export function getDownloadFromBlob(recordingBlob: RecordingBlob): RecordingDownload {
  const { mimeType, url } = recordingBlob;
  const extension = getExtension(mimeType);
  return { mimeType, url, extension };
}
