export type EventArrayEventType = 'push';

export type EventArraySubscription<T> = {
  eventType: EventArrayEventType;
  callback: (items: T[]) => void;
};

export class EventArray<T> extends Array<T> {
  private subscriptions: EventArraySubscription<T>[];

  public constructor(...items: T[]) {
    super(...items);
    Object.setPrototypeOf(this, EventArray.prototype);
    this.subscriptions = [];
  }

  public on(eventType: EventArrayEventType, callback: (items: T[]) => void): void {
    const subscription: EventArraySubscription<T> = {
      eventType,
      callback,
    };
    this.subscriptions.push(subscription);
  }

  private dispatch(eventType: EventArrayEventType, items: T[]): void {
    const subscriptions = this.subscriptions.filter((s) => s.eventType === eventType);
    for (const subscription of subscriptions) {
      try {
        subscription.callback(items);
      } catch (error) {
        console.error(error);
      }
    }
  }

  push(...items: T[]): number {
    const result = super.push(...items);
    this.dispatch('push', items);
    return result;
  }
}
