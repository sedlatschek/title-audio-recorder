import { PubSub } from './PubSub';

export class EventArray<T> extends Array<T> {
  private pushPubSub = new PubSub<T[], void>();

  public constructor(...items: T[]) {
    super(...items);
    Object.setPrototypeOf(this, EventArray.prototype);
  }

  public onPush(callback: (items: T[]) => Promise<void>): void {
    this.pushPubSub.on(callback);
  }

  push(...items: T[]): number {
    const result = super.push(...items);
    this.pushPubSub.emit(items);
    return result;
  }
}
