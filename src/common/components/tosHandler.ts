import { Component } from 'vue';
import { BrowserStorageTosAcceptanceStorage } from '../tos/BrowserStorageTosAcceptanceStorage1';
import { TosHandler } from '../tos/TosHandler';
import { TosVersion } from '../tos/TosVersion';

export function createTosHandler(): TosHandler {
  const tosVersions: TosVersion[] = Object.entries(
    import.meta.glob<{ default: Component }>('../tos/documents/*.vue', { eager: true }),
  ).map(([path, module]) => ({
    name: path.replace(/^.*\/([^/]+)\.vue$/, '$1'),
    component: module.default,
  }));

  const tosStorage = new BrowserStorageTosAcceptanceStorage();
  return new TosHandler(tosStorage, tosVersions);
}
