import { isMimeType, MimeType } from '../../common/MimeType';
import { RecordingBlob as IRecordingBlob } from '../../common/RecordingBlob';

export class RecordingBlob implements IRecordingBlob {
  public readonly mimeType: MimeType;
  public readonly url: string;

  constructor(public readonly blob: Blob) {
    if (!isMimeType(blob.type)) {
      throw new Error(`Invalid blob type ${blob.type}`);
    }
    this.mimeType = blob.type;
    this.url = URL.createObjectURL(blob);
  }

  public revoke(): void {
    URL.revokeObjectURL(this.url);
  }
}
