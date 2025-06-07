import { AppearanceModeChangeDetector } from '../appearanceMode/AppearanceModeChangeDetector';
import { HtmlMediaQueryAppearanceModeChangeDetector } from '../appearanceMode/HtmlMediaQueryAppearanceModeChangeDetector';

export function createAppearanceModeChangeDetector(): AppearanceModeChangeDetector {
  return new HtmlMediaQueryAppearanceModeChangeDetector();
}
