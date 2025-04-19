import { MimeType } from '../../common/MimeType';

export type ConfigurationSettings = {
  downloadMimeTypes: MimeType[];
  downloadAutomatically: boolean;
};
