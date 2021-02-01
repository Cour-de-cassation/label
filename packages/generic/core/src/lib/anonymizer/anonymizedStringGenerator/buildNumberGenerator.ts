import { anonymizedGeneratorType } from './types';

export { buildNumberGenerator };

function buildNumberGenerator(): anonymizedGeneratorType {
  let currentValue = 1;

  return {
    generate() {
      const generatedNumber = currentValue;
      currentValue++;

      return generatedNumber.toString();
    },
  };
}
