import { ConfigurationSettings } from './ConfigurationSettings';

export type ConfigurationChangeListener<T extends keyof ConfigurationSettings> = (
  property: T,
  value: ConfigurationSettings[T],
) => void;

export interface ConfigurationHandler {
  setAll(settings: ConfigurationSettings): Promise<void>;
  getAll(): Promise<ConfigurationSettings>;
  set<T extends keyof ConfigurationSettings>(
    property: T,
    value: ConfigurationSettings[T],
  ): Promise<void>;
  get<T extends keyof ConfigurationSettings>(key: T): Promise<ConfigurationSettings[T]>;
  onChange(callback: ConfigurationChangeListener<keyof ConfigurationSettings>): void;
}
