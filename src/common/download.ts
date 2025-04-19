import sanitize from 'sanitize-filename';
import browser from 'webextension-polyfill';
import { RecordingDownload, RecordingMetadata } from './RecordingMetadata';

export function downloadRecording(
  recording: RecordingMetadata,
  recordingDownload?: RecordingDownload,
): Promise<number> {
  const download = recordingDownload ?? recording.downloads[0];
  if (!download) {
    throw new Error(`Recording ${recording.id} has no downloads`);
  }

  return browser.downloads.download({
    url: download.url,
    filename: `${sanitize(recording.title)}.${download.extension}`,
  });
}
