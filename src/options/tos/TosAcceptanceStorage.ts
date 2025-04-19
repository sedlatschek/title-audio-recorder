import { TosVersion } from './TosVersion';

export interface TosAcceptanceStorage {
  accept(tosVersion: TosVersion): Promise<void>;
  isAccepted(tosVersion: TosVersion): Promise<boolean>;
  onTosAccepted(callback: (tosVersion: TosVersion) => Promise<void>): void;
}
