import { Converter } from '../converter/Converter';
import { getConfigurationHandler } from './configurationHandler';

let converter: Converter | undefined;

export function getConverter(): Converter {
  if (converter === undefined) {
    converter = new Converter(getConfigurationHandler());
  }
  return converter;
}
