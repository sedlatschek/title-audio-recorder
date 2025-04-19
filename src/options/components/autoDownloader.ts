import { AutoDownloader } from '../AutoDownloader';
import { getConfigurationHandler } from './configurationHandler';
import { getRecorder } from './recorder';

let autoDownloader: AutoDownloader | undefined;

export function getAutoDownloader(): AutoDownloader {
  if (autoDownloader === undefined) {
    autoDownloader = new AutoDownloader(getConfigurationHandler(), getRecorder());
  }
  return autoDownloader;
}
