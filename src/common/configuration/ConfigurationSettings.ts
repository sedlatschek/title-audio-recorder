import { MimeType } from '../../common/MimeType';

export type ConfigurationSettings = {
  downloadMimeTypes: MimeType[];
  downloadAutomatically: boolean;
  removeAfterDownloadingAutomatically: boolean;
  numberRecordings: boolean;
};
