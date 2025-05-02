import { BrowserStorageConfigurationHandler } from '../configuration/BrowserStorageConfigurationHandler1';
import { ConfigurationHandler } from '../configuration/ConfigurationHandler';

export function createConfigurationHandler(): ConfigurationHandler {
  return new BrowserStorageConfigurationHandler();
}
