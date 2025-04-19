import { FFmpeg } from '@ffmpeg/ffmpeg';
import browser from 'webextension-polyfill';

export async function createFFmpeg(): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();
  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: browser.runtime.getURL('lib/ffmpeg-core.js'),
      wasmURL: browser.runtime.getURL('lib/ffmpeg-core.wasm'),
    });
  }
  return ffmpeg;
}
