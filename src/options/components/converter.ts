import { Converter } from '../converter/Converter';
import { getSettings } from './settings';

let converter: Converter | undefined;

export function getConverter(): Converter {
  if (converter === undefined) {
    converter = new Converter(getSettings());
  }
  return converter;
}
