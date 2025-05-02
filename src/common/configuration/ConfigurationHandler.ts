import { ConfigurationSettings } from './ConfigurationSettings';

export interface ConfigurationHandler {
  getSettings(): Promise<ConfigurationSettings>;
  setSettings(configurationSettings: ConfigurationSettings): Promise<void>;
  set<T extends keyof ConfigurationSettings>(
    key: T,
    value: ConfigurationSettings[T],
  ): Promise<void>;
  onSettingsUpdate(callback: (configurationSettings: ConfigurationSettings) => Promise<void>): void;
}
