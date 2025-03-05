type Subscriber<EventType, ReturnType> = (event: EventType) => ReturnType;

export class PubSub<EventType, ReturnType> {
  private readonly subscribers: Subscriber<EventType, Promise<ReturnType>>[];

  constructor() {
    this.subscribers = [];
  }

  public on(subscriber: Subscriber<EventType, Promise<ReturnType>>): void {
    this.subscribers.push(subscriber);
  }

  public emit(event: EventType): Promise<ReturnType[]> {
    return Promise.all(this.subscribers.map((subscriber) => subscriber(event)));
  }
}
