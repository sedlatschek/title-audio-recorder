import browser from 'webextension-polyfill';
import { ConfigurationChangeListener, ConfigurationHandler } from './ConfigurationHandler';
import { ConfigurationSettings, isConfigurationSettings } from './ConfigurationSettings';
import { getDefaultConfigurationSettings } from './defaultConfigurationSettings';

export class BrowserStorageConfigurationHandler implements ConfigurationHandler {
  private storageArea = browser.storage.sync;
  private storageKey = 'title-audio-recorder-configuration';
  private onChangeListeners: ConfigurationChangeListener<keyof ConfigurationSettings>[] = [];

  constructor() {
    this.setupChangeListener();
  }

  private setupChangeListener(): void {
    this.storageArea.onChanged.addListener((changes) => {
      if (changes[this.storageKey]) {
        const { newValue, oldValue } = changes[this.storageKey];

        if (!isConfigurationSettings(newValue)) {
          console.warn(
            `[${BrowserStorageConfigurationHandler.name}] Invalid change detected:`,
            changes[this.storageKey],
          );
          return;
        }

        for (const property of Object.keys(newValue) as (keyof ConfigurationSettings)[]) {
          if (!isConfigurationSettings(oldValue) || newValue[property] !== oldValue[property]) {
            this.onChangeListeners.forEach((callback) => {
              console.debug(
                `[${BrowserStorageConfigurationHandler.name}] Change detected for property:`,
                property,
                'value:',
                newValue[property],
              );
              callback(property, newValue[property]);
            });
          }
        }
      }
    });
  }

  public async setAll(settings: ConfigurationSettings): Promise<void> {
    console.debug(
      `[${BrowserStorageConfigurationHandler.name}] Setting all configuration settings:`,
      settings,
    );
    await browser.storage.sync.set({ [this.storageKey]: settings });
  }

  public async getAll(): Promise<ConfigurationSettings> {
    const settings = await this.storageArea.get(this.storageKey);
    if (settings[this.storageKey]) {
      return settings[this.storageKey] as ConfigurationSettings;
    }
    return getDefaultConfigurationSettings();
  }

  public async set<T extends keyof ConfigurationSettings>(
    property: T,
    value: ConfigurationSettings[T],
  ): Promise<void> {
    const settings = await this.getAll();
    settings[property] = value;
    console.debug(
      `[${BrowserStorageConfigurationHandler.name}] Setting property:`,
      property,
      'value:',
      value,
    );
    await this.storageArea.set({ [this.storageKey]: settings });
  }

  public async get<T extends keyof ConfigurationSettings>(
    property: T,
  ): Promise<ConfigurationSettings[T]> {
    const settings = await this.getAll();
    const value = settings[property];
    console.debug(
      `[${BrowserStorageConfigurationHandler.name}] Retrieved property:`,
      property,
      'value:',
      value,
    );
    return value;
  }

  public onChange(callback: ConfigurationChangeListener<keyof ConfigurationSettings>): void {
    this.onChangeListeners.push(callback);
  }
}
