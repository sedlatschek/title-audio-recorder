import browser from 'webextension-polyfill';
import { getDefaultStorageContent } from './defaultStorageContent';
import { StorageContent } from './StorageContent';
import { StorageChangeListener, StorageHandler } from './StorageHandler';

export class BrowserStorageStorageHandler implements StorageHandler {
  private storageKey = 'title-audio-recorder-storage';
  private onChangeListeners: StorageChangeListener<keyof StorageContent>[] = [];

  constructor() {
    this.setupChangeListener();
  }

  private setupChangeListener(): void {
    browser.storage.local.onChanged.addListener((changes) => {
      if (changes[this.storageKey]) {
        const { newValue, oldValue } = changes[this.storageKey] as {
          oldValue: StorageContent;
          newValue: StorageContent;
        };

        for (const property of Object.keys(oldValue) as (keyof StorageContent)[]) {
          if (newValue[property] !== oldValue[property]) {
            this.onChangeListeners.forEach((callback) => {
              console.debug(
                `[${BrowserStorageStorageHandler.name}] Change detected for property:`,
                property,
                'Old value:',
                oldValue[property],
                'New value:',
                newValue[property],
              );
              callback(property, newValue[property]);
            });
          }
        }
      }
    });
  }

  private async getStorageContent(): Promise<StorageContent> {
    const properties = await browser.storage.local.get(this.storageKey);
    if (properties[this.storageKey]) {
      return properties[this.storageKey] as StorageContent;
    }
    return getDefaultStorageContent();
  }

  async get<T extends keyof StorageContent>(property: T): Promise<StorageContent[T]> {
    const storageContent = await this.getStorageContent();
    const value = storageContent[property];
    console.debug(
      `[${BrowserStorageStorageHandler.name}] Retrieved property:`,
      property,
      'Value:',
      value,
    );
    return value;
  }

  async set<T extends keyof StorageContent>(property: T, value: StorageContent[T]): Promise<void> {
    const storageContent = await this.getStorageContent();
    const newStorageContent = {
      ...storageContent,
      [property]: value,
    };
    console.debug(
      `[${BrowserStorageStorageHandler.name}] Setting property:`,
      property,
      'Value:',
      value,
    );
    await browser.storage.local.set({ [this.storageKey]: newStorageContent });
  }

  onChange(callback: StorageChangeListener<keyof StorageContent>): void {
    this.onChangeListeners.push(callback);
  }
}
