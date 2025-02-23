import { HtmlTitleChangeDetector } from './HtmlTitleChangeDetector';
import { TitleChangeDetector } from './TitleChangeDetector';

const titleChangeDetector: TitleChangeDetector = new HtmlTitleChangeDetector();
titleChangeDetector.onTitleChanged((title: string) => {
  console.info(`Title changed to ${title}`);
});

