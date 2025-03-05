import { TitleChangeDetector, TitleChangeHandler } from './TitleChangeDetector';

export class HtmlTitleChangeDetector implements TitleChangeDetector {
  private handlers: TitleChangeHandler[] = [];

  public constructor() {
    const observer = new MutationObserver(() => {
      this.publishTitleChangedEvent(this.getTitleHtmlElement().innerText, window.location.href);
    });
    observer.observe(this.getTitleHtmlElement(), {
      subtree: true,
      characterData: true,
      childList: true,
    });
  }

  private getTitleHtmlElement(): HTMLElement {
    const htmlElement = document.querySelector('title');
    if (!htmlElement) {
      throw new Error('Could not find title HTML element');
    }
    return htmlElement;
  }

  private publishTitleChangedEvent(title: string, url: string): void {
    for (const handler of this.handlers) {
      handler(title, url);
    }
  }

  onTitleChanged(handler: TitleChangeHandler): void {
    this.handlers.push(handler);
  }
}
