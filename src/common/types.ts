const appearanceModes = ['light', 'dark'] as const;
export type AppearanceMode = (typeof appearanceModes)[number];
export function isAppearanceMode(value: unknown): value is AppearanceMode {
  return typeof value === 'string' && appearanceModes.includes(value as AppearanceMode);
}

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
