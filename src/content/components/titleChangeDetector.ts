import { HtmlTitleChangeDetector } from '../title/HtmlTitleChangeDetector';
import { TitleChangeDetector } from '../title/TitleChangeDetector';

export function createTitleChangeDetector(): TitleChangeDetector {
  return new HtmlTitleChangeDetector();
}
