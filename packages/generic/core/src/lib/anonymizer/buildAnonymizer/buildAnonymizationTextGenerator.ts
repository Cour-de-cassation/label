import { parseFormatSpecifiers } from './parseFormatSpecifiers';
import { specifierGeneratorType } from './types';

export { buildAnonymizationTextGenerator };

function buildAnonymizationTextGenerator(printfString: string, specifierGenerator: specifierGeneratorType) {
  const parsedFormatSpecifiers = parseFormatSpecifiers(printfString);

  return {
    generate,
  };

  function generate(entityId: string) {
    return parsedFormatSpecifiers.reduce((printedString, parsedFormatSpecifier) => {
      const stringPrefix = printedString.slice(0, parsedFormatSpecifier.index);
      const specifierValue = specifierGenerator[parsedFormatSpecifier.specifier].generate(entityId);
      const stringSuffix = printedString.slice(parsedFormatSpecifier.index + parsedFormatSpecifier.specifier.length);

      return `${stringPrefix}${specifierValue}${stringSuffix}`;
    }, printfString);
  }
}
