import { MimeType } from '../options/MimeType';
import { UUID } from './types';

export type RecordingDownload = {
  mimeType: MimeType;
  url: string;
  extension: string;
};

export interface RecordingMetadata {
  readonly id: UUID;
  readonly tabId: number;
  readonly title: string;
  readonly pageUrl: string;
  readonly startedAtTs?: number;
  readonly stoppedAtTs?: number;
  readonly downloads: RecordingDownload[];
}
