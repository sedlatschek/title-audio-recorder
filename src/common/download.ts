import sanitize from 'sanitize-filename';
import browser from 'webextension-polyfill';
import { RecordingMetadata } from './RecordingMetadata';

export function downloadRecording(recording: RecordingMetadata): Promise<number> {
  const download = recording.downloads[0];
  if (!download) {
    throw new Error(`Recording ${recording.id} has no downloads`);
  }

  return browser.downloads.download({
    url: download.url,
    filename: `${sanitize(recording.title)}.${download.extension}`,
  });
}
