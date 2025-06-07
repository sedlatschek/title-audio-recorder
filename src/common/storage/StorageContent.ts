import { AppearanceMode } from '../types';

export interface StorageContent {
  appearanceMode: AppearanceMode;
}

export function isStorageContent(content: unknown): content is StorageContent {
  return typeof content === 'object' && content !== null && 'appearanceMode' in content;
}
