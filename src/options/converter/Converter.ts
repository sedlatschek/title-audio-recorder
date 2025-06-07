import { ConfigurationHandler } from '../../common/configuration/ConfigurationHandler';
import { MimeType } from '../../common/MimeType';
import { Conversion } from './Conversion';
import { WebmToMp3Conversion } from './WebmToMp3Conversion';

export class Converter {
  private readonly conversions: Conversion[] = [new WebmToMp3Conversion()];

  public constructor(private readonly configurationHandler: ConfigurationHandler) {}

  private getConversion(inputMimeType: MimeType, outputMimeType: MimeType): Conversion | undefined {
    return this.conversions.find(
      (c) => c.inputMimeType === inputMimeType && c.outputMimeType === outputMimeType,
    );
  }

  public async convert(blob: Blob): Promise<Blob[]> {
    const mimeTypes = await this.configurationHandler.get('downloadMimeTypes');
    console.debug(
      `[${Converter.name}] Converting blob with type ${blob.type} to ${mimeTypes.join(', ')}`,
    );
    return Promise.all(
      mimeTypes
        .map((mimeType) => this.getConversion(blob.type as MimeType, mimeType))
        .filter((c) => c !== undefined)
        .map((c) => c.convert(blob)),
    );
  }
}
