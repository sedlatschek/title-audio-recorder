import { downloadRecording } from '../common/download';
import { ConfigurationHandler } from './configuration/ConfigurationHandler';
import { Recorder } from './recorder/Recorder';
import { Recording } from './recorder/Recording';
import { RecordingSession } from './recorder/RecordingSession';

export class AutoDownloader {
  public constructor(
    private readonly configurationHandler: ConfigurationHandler,
    private readonly recorder: Recorder<RecordingSession<Recording>, Recording>,
  ) {
    this.listenForAutoDownload();
  }

  private listenForAutoDownload(): void {
    this.recorder.onRecordingDownloadAdded(async ({ recording, recordingDownload }) => {
      const settings = await this.configurationHandler.getSettings();

      if (!settings.downloadAutomatically) {
        return;
      }

      if (!settings.downloadMimeTypes.includes(recordingDownload.mimeType)) {
        return;
      }

      console.debug(`[AutoDownloader] downloading recording ${recording.id}`);
      await downloadRecording(recording, recordingDownload);
    });
  }
}
