import browser from 'webextension-polyfill';
import { AppearanceMode } from '../common/types';

export class IconSwitcher {
  private readonly darkIcons: Record<number, string>;
  private readonly lightIcons: Record<number, string>;

  public constructor() {
    this.darkIcons = this.suffixIconPaths('dark');
    this.lightIcons = this.suffixIconPaths('light');
  }

  private suffixIconPaths(suffix: string): Record<number, string> {
    return [16, 32, 48, 96, 128].reduce<Record<number, string>>((acc, size) => {
      acc[size] = `/icon/${size}_${suffix}.png`;
      return acc;
    }, {});
  }

  public switchTo(appearanceMode: AppearanceMode): Promise<void> {
    console.debug(`[${IconSwitcher.name}] Switching to ${appearanceMode} mode`);
    return browser.action.setIcon({
      path: appearanceMode === 'dark' ? this.darkIcons : this.lightIcons,
    });
  }
}
