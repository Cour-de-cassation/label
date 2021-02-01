import { buildSpecifierValueGenerator } from './buildSpecifierValueGenerator';
import { anonymizedGeneratorType, formatSpecifierType, specifierType } from './types';

export { buildAnonymizedStringGenerator };

function buildAnonymizedStringGenerator(printfString: string): anonymizedGeneratorType {
  const parsedFormatSpecifiers = parseFormatSpecifiers();

  return {
    generate() {
      return sprintf();
    },
  };

  function sprintf() {
    return parsedFormatSpecifiers.reduce((printedString, parsedFormatSpecifier) => {
      const stringPrefix = printedString.slice(0, parsedFormatSpecifier.index);
      const specifierValue = parsedFormatSpecifier.value.generate();
      const stringSuffix = printedString.slice(parsedFormatSpecifier.index + parsedFormatSpecifier.specifier.length);

      return `${stringPrefix}${specifierValue}${stringSuffix}`;
    }, printfString);
  }

  function parseFormatSpecifiers(): formatSpecifierType[] {
    const regex = RegExp('%(c|d)', 'g');
    let parsedFormatSpecifier: RegExpExecArray | null;

    const parsedFormatSpecifiers = [];

    while ((parsedFormatSpecifier = regex.exec(printfString)) !== null) {
      const specifier = parsedFormatSpecifier[0] as specifierType;

      parsedFormatSpecifiers.push({
        index: parsedFormatSpecifier.index,
        specifier,
        value: buildSpecifierValueGenerator(specifier),
      });
    }

    return parsedFormatSpecifiers;
  }
}
