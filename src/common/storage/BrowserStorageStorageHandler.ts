import browser from 'webextension-polyfill';
import { getDefaultStorageContent } from './defaultStorageContent';
import { isStorageContent, StorageContent } from './StorageContent';
import { StorageChangeListener, StorageHandler } from './StorageHandler';

export class BrowserStorageStorageHandler implements StorageHandler {
  private storageArea = browser.storage.local;
  private storageKey = 'title-audio-recorder-storage';
  private onChangeListeners: StorageChangeListener<keyof StorageContent>[] = [];

  constructor() {
    this.setupChangeListener();
  }

  private setupChangeListener(): void {
    this.storageArea.onChanged.addListener((changes) => {
      if (changes[this.storageKey]) {
        const { newValue, oldValue } = changes[this.storageKey];

        if (!isStorageContent(newValue)) {
          console.warn(
            `[${BrowserStorageStorageHandler.name}] Invalid change detected:`,
            changes[this.storageKey],
          );
          return;
        }

        for (const property of Object.keys(newValue) as (keyof StorageContent)[]) {
          if (!isStorageContent(oldValue) || newValue[property] !== oldValue[property]) {
            this.onChangeListeners.forEach((callback) => {
              console.debug(
                `[${BrowserStorageStorageHandler.name}] Change detected for property:`,
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

  private async getStorageContent(): Promise<StorageContent> {
    const properties = await this.storageArea.get(this.storageKey);
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
      'value:',
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
      'value:',
      value,
    );
    await this.storageArea.set({ [this.storageKey]: newStorageContent });
  }

  onChange(callback: StorageChangeListener<keyof StorageContent>): void {
    this.onChangeListeners.push(callback);
  }
}
