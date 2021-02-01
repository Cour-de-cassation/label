import { buildAnonymizedStringGenerator } from './buildAnonymizedStringGenerator';

describe('buildAnonymizedStringGenerator', () => {
  describe('generate', () => {
    describe('%d case', () => {
      it('should generate an anonymized string according to the printf string format', () => {
        const printfString = 'STRING %d';
        const anonymizedStringGenerator = buildAnonymizedStringGenerator(printfString);

        const anonymizedString = anonymizedStringGenerator.generate();

        expect(anonymizedString).toEqual('STRING 1');
      });

      it('should generate an anonymized string according to the printf string format (several calls)', () => {
        const printfString = 'STRING %d';
        const anonymizedStringGenerator = buildAnonymizedStringGenerator(printfString);

        const firstAnonymizedString = anonymizedStringGenerator.generate();
        const secondAnonymizedString = anonymizedStringGenerator.generate();
        const thirdAnonymizedString = anonymizedStringGenerator.generate();

        expect(firstAnonymizedString).toEqual('STRING 1');
        expect(secondAnonymizedString).toEqual('STRING 2');
        expect(thirdAnonymizedString).toEqual('STRING 3');
      });
    });

    describe('%c case', () => {
      it('should generate an anonymized string according to the printf string format', () => {
        const printfString = 'STRING %c';
        const anonymizedStringGenerator = buildAnonymizedStringGenerator(printfString);

        const anonymizedString = anonymizedStringGenerator.generate();

        expect(anonymizedString.startsWith('STRING ')).toEqual(true);
      });

      it('should generate an anonymized string according to the printf string format (several calls)', () => {
        const printfString = 'STRING %c';
        const anonymizedStringGenerator = buildAnonymizedStringGenerator(printfString);

        const firstAnonymizedString = anonymizedStringGenerator.generate();
        const secondAnonymizedString = anonymizedStringGenerator.generate();
        const thirdAnonymizedString = anonymizedStringGenerator.generate();

        expect(firstAnonymizedString.startsWith('STRING ')).toEqual(true);
        expect(secondAnonymizedString.startsWith('STRING ')).toEqual(true);
        expect(thirdAnonymizedString.startsWith('STRING ')).toEqual(true);
      });
    });
  });
});
