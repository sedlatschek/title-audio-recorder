import { AppearanceMode } from '../types';

export type AppearanceModeChangeHandler = (appearanceMode: AppearanceMode) => Promise<void>;

export interface AppearanceModeChangeDetector {
  getAppearanceMode(): Promise<AppearanceMode>;
  onAppearanceModeChanged(handler: AppearanceModeChangeHandler): void;
  fire(): void;
}
