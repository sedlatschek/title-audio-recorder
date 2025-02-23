export type TitleChangeHandler = (newTitle: string) => void;

export interface TitleChangeDetector {
  onTitleChanged(handler: TitleChangeHandler): void;
}
