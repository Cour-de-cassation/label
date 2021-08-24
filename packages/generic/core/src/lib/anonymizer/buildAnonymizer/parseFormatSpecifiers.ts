import { formatSpecifierType, specifierType } from './types';

export { parseFormatSpecifiers };

function parseFormatSpecifiers(printfString: string): formatSpecifierType[] {
  const regex = RegExp('%(c|d)', 'g');
  let parsedFormatSpecifier: RegExpExecArray | null;

  const parsedFormatSpecifiers = [];

  while ((parsedFormatSpecifier = regex.exec(printfString)) !== null) {
    const specifier = parsedFormatSpecifier[0] as specifierType;

    parsedFormatSpecifiers.push({
      index: parsedFormatSpecifier.index,
      specifier,
    });
  }

  return parsedFormatSpecifiers;
}
