import { ConfigurationSettings } from './ConfigurationSettings';

export interface ConfigurationHandler {
  getSettings(): Promise<ConfigurationSettings>;
  setSettings(configurationSettings: ConfigurationSettings): Promise<void>;
  onSettingsUpdate(callback: (configurationSettings: ConfigurationSettings) => Promise<void>): void;
}
