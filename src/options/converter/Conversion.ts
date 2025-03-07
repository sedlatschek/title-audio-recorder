import { MimeType } from '../../common/MimeType';

export interface Conversion {
  readonly inputMimeType: MimeType;
  readonly outputMimeType: MimeType;
  convert(blob: Blob): Promise<Blob>;
}
