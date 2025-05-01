import browser from 'webextension-polyfill';
import { PubSub } from '../../common/PubSub';
import { TosAcceptanceStorage } from './TosAcceptanceStorage';
import { TosVersion } from './TosVersion';

export class BrowserStorageTosAcceptanceStorage implements TosAcceptanceStorage {
  private storageKey = 'title-audio-recorder-tos';
  private readonly acceptPubSub = new PubSub<TosVersion, void>();

  onTosAccepted(callback: (tosVersion: TosVersion) => Promise<void>): void {
    this.acceptPubSub.on(callback);
  }

  private async getTosAcceptances(): Promise<Record<string, boolean>> {
    const storage = await browser.storage.local.get(this.storageKey);
    const tosAcceptances = storage[this.storageKey] as Record<string, boolean>;
    return tosAcceptances ?? {};
  }

  public async accept(tosVersion: TosVersion): Promise<void> {
    const tosAcceptances = await this.getTosAcceptances();
    const newTosAcceptances = { ...tosAcceptances, [tosVersion.name]: true };
    console.debug(`[${BrowserStorageTosAcceptanceStorage.name}] accept ToS "${tosVersion.name}"`);
    await browser.storage.local.set({ [this.storageKey]: newTosAcceptances });
    await this.acceptPubSub.emit(tosVersion);
  }

  public async isAccepted(tosVersion: TosVersion): Promise<boolean> {
    const tosAcceptances = await this.getTosAcceptances();
    const result = !!tosAcceptances[tosVersion.name];
    console.debug(
      `[${BrowserStorageTosAcceptanceStorage.name}] ToS "${tosVersion.name}" is accepted:`,
      result,
    );
    return result;
  }
}
