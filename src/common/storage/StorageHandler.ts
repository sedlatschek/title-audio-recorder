import { StorageContent } from './StorageContent';

export type StorageChangeListener<T extends keyof StorageContent> = (
  property: T,
  value: StorageContent[T],
) => void;

export interface StorageHandler {
  get<T extends keyof StorageContent>(property: T): Promise<StorageContent[T]>;
  set<T extends keyof StorageContent>(property: T, value: StorageContent[T]): Promise<void>;
  onChange(callback: StorageChangeListener<keyof StorageContent>): void;
}
