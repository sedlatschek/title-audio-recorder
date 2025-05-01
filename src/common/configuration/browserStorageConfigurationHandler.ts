import browser from 'webextension-polyfill';
import { PubSub } from '../../common/PubSub';
import { ConfigurationHandler } from './ConfigurationHandler';
import { ConfigurationSettings } from './ConfigurationSettings';
import { getDefaultConfigurationSettings } from './defaultConfigurationSettings';

export class BrowserStorageConfigurationHandler implements ConfigurationHandler {
  private storageKey = 'title-audio-recorder-configuration';
  private updatedPubSub = new PubSub<ConfigurationSettings, void>();

  constructor() {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && changes.options?.newValue) {
        this.updatedPubSub.emit(changes.options.newValue as ConfigurationSettings);
      }
    });
  }

  public async getSettings(): Promise<ConfigurationSettings> {
    const properties = await browser.storage.sync.get(this.storageKey);
    if (properties[this.storageKey]) {
      return properties[this.storageKey] as ConfigurationSettings;
    }
    return getDefaultConfigurationSettings();
  }

  public setSettings(properties: ConfigurationSettings): Promise<void> {
    console.debug('[BrowserStorageConfigurationHandler] settings set', properties);
    return browser.storage.sync.set({ [this.storageKey]: properties });
  }

  public onSettingsUpdate(callback: (properties: ConfigurationSettings) => Promise<void>): void {
    this.updatedPubSub.on(callback);
  }
}
