import { MimeType } from '../../common/MimeType';

export type ConfigurationSettings = {
  downloadMimeTypes: MimeType[];
  downloadAutomatically: boolean;
  removeAfterDownloadingAutomatically: boolean;
  numberRecordings: boolean;
};

export function isConfigurationSettings(value: unknown): value is ConfigurationSettings {
  return (
    typeof value === 'object' &&
    value !== null &&
    'downloadMimeTypes' in value &&
    'downloadAutomatically' in value &&
    'removeAfterDownloadingAutomatically' in value &&
    'numberRecordings' in value
  );
}
