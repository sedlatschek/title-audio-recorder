import { TosAcceptanceStorage } from './TosAcceptanceStorage';
import { TosVersion } from './TosVersion';

export class TosHandler {
  constructor(
    private readonly tosStorage: TosAcceptanceStorage,
    public readonly tosVersions: TosVersion[],
  ) {
    if (this.tosVersions.length === 0) {
      throw new Error('At least one ToS version is required');
    }
    this.tosVersions.sort((a, b) => a.name.localeCompare(b.name));
  }

  public onTosAccepted(callback: (tosVersion: TosVersion) => Promise<void>): void {
    this.tosStorage.onTosAccepted(callback);
  }

  public getLatestTosVersion(): TosVersion {
    return this.tosVersions[this.tosVersions.length - 1];
  }

  public isAccepted(tosVersion: TosVersion): Promise<boolean> {
    return this.tosStorage.isAccepted(tosVersion);
  }

  public accept(tosVersion: TosVersion): Promise<void> {
    return this.tosStorage.accept(tosVersion);
  }
}
