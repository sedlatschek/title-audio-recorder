export const mimeTypeToExtensionMap = {
  'audio/webm': 'webm',
  'audio/mpeg': 'mp3',
} as const;

export type MimeType = keyof typeof mimeTypeToExtensionMap;

export type MimeTypeExtension = (typeof mimeTypeToExtensionMap)[MimeType];

export function isMimeType(value: unknown): value is MimeType {
  return typeof value === 'string' && value in mimeTypeToExtensionMap;
}

export function getExtension(mimeType: MimeType): MimeTypeExtension {
  return mimeTypeToExtensionMap[mimeType];
}
