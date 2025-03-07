import { Settings } from '../settings/settings';

let settings: Settings | undefined;

export function getSettings(): Settings {
  if (settings === undefined) {
    settings = new Settings();
  }
  return settings;
}
