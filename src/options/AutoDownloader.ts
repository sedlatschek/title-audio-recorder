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
    this.recorder.onRecordingBlobAdded(async ({ recording, recordingBlob }) => {
      const settings = await this.configurationHandler.getSettings();

      if (!settings.downloadAutomatically) {
        return;
      }

      if (!settings.downloadMimeTypes.includes(recordingBlob.mimeType)) {
        return;
      }

      console.debug(`[AutoDownloader] downloading recording ${recording.id}`);

      await this.recorder.downloadRecording(recording);
    });
  }
}
