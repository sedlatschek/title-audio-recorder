import { BrowserStorageConfigurationHandler } from '../configuration/browserStorageConfigurationHandler';
import { ConfigurationHandler } from '../configuration/ConfigurationHandler';

let configurationHandler: ConfigurationHandler | undefined;

export function getConfigurationHandler(): ConfigurationHandler {
  if (configurationHandler === undefined) {
    configurationHandler = new BrowserStorageConfigurationHandler();
  }
  return configurationHandler;
}
