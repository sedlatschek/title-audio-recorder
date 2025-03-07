import { FFmpeg } from '@ffmpeg/ffmpeg';
import browser from 'webextension-polyfill';

let ffmpeg: FFmpeg | undefined;

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg === undefined) {
    ffmpeg = new FFmpeg();
    if (!ffmpeg.loaded) {
      await ffmpeg.load({
        coreURL: browser.runtime.getURL('lib/ffmpeg-core.js'),
        wasmURL: browser.runtime.getURL('lib/ffmpeg-core.wasm'),
      });
    }
  }
  return ffmpeg;
}
