import { ConfigurationHandler } from '../common/configuration/ConfigurationHandler';
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
      const { downloadAutomatically, downloadMimeTypes, removeAfterDownloadingAutomatically } =
        await this.configurationHandler.getAll();

      if (!downloadAutomatically) {
        return;
      }

      if (!downloadMimeTypes.includes(recordingBlob.mimeType)) {
        return;
      }

      console.debug(`[${AutoDownloader.name}] Downloading recording ${recording.id}`);

      await this.recorder.downloadRecording(recording);

      if (removeAfterDownloadingAutomatically) {
        console.debug(`[${AutoDownloader.name}] Deleting recording ${recording.id}`);
        await this.recorder.removeRecording(recording);
      }
    });
  }
}
