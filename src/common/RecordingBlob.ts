import { MimeType } from './MimeType';

export interface RecordingBlob {
  readonly mimeType: MimeType;
  readonly url: string;
}
