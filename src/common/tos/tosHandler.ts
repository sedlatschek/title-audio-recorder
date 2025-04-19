import { Component } from 'vue';
import { BrowserStorageTosAcceptanceStorage } from '../../options/tos/browserStorageTosAcceptanceStorage';
import { TosHandler } from '../../options/tos/TosHandler';
import { TosVersion } from '../../options/tos/TosVersion';

export function createTosHandler(): TosHandler {
  const tosVersions: TosVersion[] = Object.entries(
    import.meta.glob<{ default: Component }>('./*.vue', { eager: true }),
  ).map(([path, module]) => ({
    name: path.replace(/^\.\/|\.vue$/g, ''),
    component: module.default,
  }));

  const tosStorage = new BrowserStorageTosAcceptanceStorage();
  return new TosHandler(tosStorage, tosVersions);
}
