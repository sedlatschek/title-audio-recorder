import { getFFmpeg } from '../components/ffmpeg';
import { fetchFile } from '../util';
import { Conversion } from './Conversion';

export class WebmToMp3Conversion implements Conversion {
  public readonly inputMimeType = 'audio/webm';
  public readonly outputMimeType = 'audio/mpeg';

  private readonly audioSampleRate = 44100;
  private readonly audioChannels = 2;
  private readonly audioBitrate = '192k';

  public async convert(webmBlob: Blob): Promise<Blob> {
    const id = self.crypto.randomUUID();
    const inputFile = `input-${id}.webm`;
    const outputFile = `output-${id}.mp3`;

    const ffmpeg = await getFFmpeg();
    await ffmpeg.writeFile(inputFile, await fetchFile(webmBlob));

    await ffmpeg.exec([
      '-i',
      inputFile,
      '-vn',
      '-ar',
      this.audioSampleRate.toString(),
      '-ac',
      this.audioChannels.toString(),
      '-b:a',
      this.audioBitrate,
      outputFile,
    ]);

    const data = await ffmpeg.readFile(outputFile);
    const mp3Blob = new Blob([data], { type: 'audio/mpeg' });

    return mp3Blob;
  }
}
