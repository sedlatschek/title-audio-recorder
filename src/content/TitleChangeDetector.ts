export type TitleChangeHandler = (newTitle: string, url: string) => void;

export interface TitleChangeDetector {
  onTitleChanged(handler: TitleChangeHandler): void;
}
