import { Component } from 'vue';
import { BrowserStorageTosAcceptanceStorage } from './browserStorageTosAcceptanceStorage';
import { TosHandler } from './TosHandler';
import { TosVersion } from './TosVersion';

export function createTosHandler(): TosHandler {
  const tosVersions: TosVersion[] = Object.entries(
    import.meta.glob<{ default: Component }>('./documents/*.vue', { eager: true }),
  ).map(([path, module]) => ({
    name: path.replace(/^\.\/|\.vue$/g, ''),
    component: module.default,
  }));

  const tosStorage = new BrowserStorageTosAcceptanceStorage();
  return new TosHandler(tosStorage, tosVersions);
}
