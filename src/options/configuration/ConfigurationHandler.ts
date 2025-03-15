import { ConfigurationSettings } from './ConfigurationSettings';

export interface ConfigurationHandler {
  getSettings(): Promise<ConfigurationSettings>;
  setSettings(properties: ConfigurationSettings): Promise<void>;
  onSettingsUpdate(callback: (properties: ConfigurationSettings) => Promise<void>): void;
}
