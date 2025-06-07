import { PubSub } from '../PubSub';
import { AppearanceMode } from '../types';
import {
  AppearanceModeChangeDetector,
  AppearanceModeChangeHandler,
} from './AppearanceModeChangeDetector';

const query = '(prefers-color-scheme: dark)';

export class HtmlMediaQueryAppearanceModeChangeDetector implements AppearanceModeChangeDetector {
  private onChangePubSub = new PubSub<AppearanceMode, void>();

  constructor() {
    console.debug(`[${HtmlMediaQueryAppearanceModeChangeDetector.name}] initialized`);
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', this.handleMatchMediaChange.bind(this));
  }

  private handleMatchMediaChange(mediaQueryList: MediaQueryList | MediaQueryListEvent): void {
    const appearanceMode: AppearanceMode = mediaQueryList.matches ? 'dark' : 'light';
    console.debug(
      `[${HtmlMediaQueryAppearanceModeChangeDetector.name}] appearance mode changed to ${appearanceMode}`,
    );
    this.onChangePubSub.emit(appearanceMode);
  }

  public async getAppearanceMode(): Promise<AppearanceMode> {
    const mediaQuery = window.matchMedia(query);
    return mediaQuery.matches ? 'dark' : 'light';
  }

  public onAppearanceModeChanged(handler: AppearanceModeChangeHandler): void {
    this.onChangePubSub.on(handler);
  }

  public async fire(): Promise<void> {
    const mediaQuery = window.matchMedia(query);
    this.handleMatchMediaChange(mediaQuery);
  }
}
