import { MimeType } from '../../common/MimeType';

type Properties = {
  mimeTypes: MimeType[];
};

export class Settings {
  public get(): Properties {
    return {
      mimeTypes: ['audio/mpeg'],
    };
  }
}
