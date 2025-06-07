import { BrowserStorageStorageHandler } from '../storage/BrowserStorageStorageHandler';
import { StorageHandler } from '../storage/StorageHandler';

export function createStorageHandler(): StorageHandler {
  return new BrowserStorageStorageHandler();
}
