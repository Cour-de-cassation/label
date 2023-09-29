import { annotationType } from '../../../modules';
import { parseFormatSpecifiers } from './parseFormatSpecifiers';
import { specifierGeneratorType, specifierType } from './types';

export { buildAnonymizationTextGenerator };

function buildAnonymizationTextGenerator(printfString: string, specifierGenerator: specifierGeneratorType) {
  const parsedFormatSpecifiers = parseFormatSpecifiers(printfString);

  return {
    generate,
  };

  function generate(annotation: annotationType) {
    return parsedFormatSpecifiers.reduce((printedString, parsedFormatSpecifier) => {
      const stringPrefix = printedString.slice(0, parsedFormatSpecifier.index);
      const specifierValue = computeSpecifierValue(specifierGenerator, parsedFormatSpecifier.specifier, annotation);
      const stringSuffix = printedString.slice(parsedFormatSpecifier.index + parsedFormatSpecifier.specifier.length);

      return `${stringPrefix}${specifierValue}${stringSuffix}`;
    }, printfString);
  }
}

function computeSpecifierValue(
  specifierGenerator: specifierGeneratorType,
  specifier: specifierType,
  annotation: annotationType,
) {
  switch (specifier) {
    case '%d':
      return specifierGenerator[specifier].generate();
    case '%c':
      return specifierGenerator[specifier].generate(annotation);
  }
}
