import { isMimeType, MimeType } from '../../common/MimeType';

export class RecordingBlob {
  public readonly mimeType: MimeType;
  public readonly url: string;

  constructor(public readonly blob: Blob) {
    if (!isMimeType(blob.type)) {
      throw new Error(`Invalid blob type ${blob.type}`);
    }
    this.mimeType = blob.type;
    this.url = URL.createObjectURL(blob);
  }
}
