import { ConfigurationSettings } from './ConfigurationSettings';

export function getDefaultConfigurationSettings(): ConfigurationSettings {
  return {
    downloadMimeTypes: ['audio/mpeg'],
    downloadAutomatically: false,
  };
}
