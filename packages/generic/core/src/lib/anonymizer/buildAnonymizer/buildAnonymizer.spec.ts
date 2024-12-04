import { annotationModule } from '../../../modules/annotation';
import { documentModule } from '../../../modules/document';
import { settingsModule } from '../../../modules/settings';
import { buildAnonymizer } from './buildAnonymizer';

describe('buildAnonymizer', () => {
  const settings = settingsModule.lib.buildSettings({
    firstName: { anonymization: '[FIRST_NAME %d]', status: 'annotable' },
    lastName: { anonymization: '[LAST_NAME %d]', status: 'annotable' },
    adresse: { anonymization: '[ADRESSE %d]', status: 'alwaysVisible' },
    dateNaissance: { anonymization: '[BIRTHDATE %d]', status: 'visible' },
  });
  const annotations = [
    { category: 'firstName', text: 'Benoit', start: 0, certaintyScore: 1 },
    { category: 'lastName', text: 'Serrano', start: 7, certaintyScore: 1 },
    { category: 'firstName', text: 'Nicolas', start: 37, certaintyScore: 1 },
    { category: 'lastName', text: 'Assouad', start: 45, certaintyScore: 1 },
    { category: 'firstName', text: 'Romain', start: 77, certaintyScore: 1 },
    { category: 'lastName', text: 'Glé', start: 84, certaintyScore: 1 },
  ].map(annotationModule.lib.buildAnnotation);
  const seed = 123;
  const text = 'Benoit Serrano is software engineer. Nicolas Assouad is a software engineer. Romain Glé is a designer.';

  describe('anonymizeDocument', () => {
    it('should anonymize a document', () => {
      const document = documentModule.generator.generate({
        text,
      });

      const anonymizer = buildAnonymizer(settings, annotations, seed);
      const anonymizedDocument = anonymizer.anonymizeDocument(document);

      expect(anonymizedDocument.text).toEqual(
        '[FIRST_NAME 2] [LAST_NAME 6] is software engineer. [FIRST_NAME 4] [LAST_NAME 1] is a software engineer. [FIRST_NAME 5] [LAST_NAME 3] is a designer.',
      );
    });

    it('should anonymize a different document with matching anonymization texts', () => {
      const text1 =
        'Benoit Serrano is software engineer. Nicolas Assouad is a software engineer. Romain Glé is a designer.';
      const text2 =
        'There are many people who work on this project, namely Nicolas Assouad, Benoit Serrano, not to mention Romain Glé, who works with Benoit and Nicolas.';
      const document1 = documentModule.generator.generate({
        text: text1,
      });
      const document2 = documentModule.generator.generate({
        text: text2,
      });
      const settings = settingsModule.lib.buildSettings({
        firstName: { anonymization: '[FIRST_NAME %c]' },
        lastName: { anonymization: '[LAST_NAME %c]' },
      });
      const annotations1 = [
        { category: 'firstName', text: 'Benoit', start: 0, certaintyScore: 1 },
        { category: 'lastName', text: 'Serrano', start: 7, certaintyScore: 1 },
        { category: 'firstName', text: 'Nicolas', start: 37, certaintyScore: 1 },
        { category: 'lastName', text: 'Assouad', start: 45, certaintyScore: 1 },
        { category: 'firstName', text: 'Romain', start: 77, certaintyScore: 1 },
        { category: 'lastName', text: 'Glé', start: 84, certaintyScore: 1 },
      ].map(annotationModule.lib.buildAnnotation);
      const annotations2 = [
        { category: 'firstName', text: 'Nicolas', start: 55, certaintyScore: 1 },
        { category: 'lastName', text: 'Assouad', start: 63, certaintyScore: 1 },
        { category: 'firstName', text: 'Benoit', start: 72, certaintyScore: 1 },
        { category: 'lastName', text: 'Serrano', start: 79, certaintyScore: 1 },
        { category: 'firstName', text: 'Romain', start: 103, certaintyScore: 1 },
        { category: 'lastName', text: 'Glé', start: 110, certaintyScore: 1 },
        { category: 'firstName', text: 'BENOIT', start: 130, certaintyScore: 1 },
        { category: 'firstName', text: 'NICOLAS', start: 141, certaintyScore: 1 },
      ].map(annotationModule.lib.buildAnnotation);
      annotations2[6] = annotationModule.lib.annotationLinker.link(annotations2[6], annotations2[2]);
      annotations2[7] = annotationModule.lib.annotationLinker.link(annotations2[7], annotations2[0]);
      const anonymizer1 = buildAnonymizer(settings, annotations1, seed);
      const anonymizer2 = buildAnonymizer(settings, annotations2, seed);

      const anonymizedDocument1 = anonymizer1.anonymizeDocument(document1);
      const anonymizedDocument2 = anonymizer2.anonymizeDocument(document2);

      expect(anonymizedDocument1.text).toBe(
        '[FIRST_NAME C] [LAST_NAME C] is software engineer. [FIRST_NAME J] [LAST_NAME O] is a software engineer. [FIRST_NAME R] [LAST_NAME M] is a designer.',
      );
      expect(anonymizedDocument2.text).toBe(
        'There are many people who work on this project, namely [FIRST_NAME J] [LAST_NAME O], [FIRST_NAME C] [LAST_NAME C], not to mention [FIRST_NAME R] [LAST_NAME M], who works with [FIRST_NAME C] and [FIRST_NAME J].',
      );
    });
  });

  describe('anonymize', () => {
    const anonymizer = buildAnonymizer(settings, annotations, seed);

    it('should anonymize a text with the given settings', () => {
      const anonymizedTexts = annotations.map(anonymizer.anonymize);

      expect(anonymizedTexts[0]).toEqual('[FIRST_NAME 2]');
    });
    it('should anonymize a second text with the given settings', () => {
      const anonymizedTexts = annotations.map(anonymizer.anonymize);

      expect(anonymizedTexts[1]).toEqual('[LAST_NAME 6]');
    });
    it('should conserve the same anonymisation every time it is called', () => {
      const settings = settingsModule.lib.buildSettings({
        firstName: { anonymization: '[FIRST_NAME %c]' },
      });
      const annotations = [
        { category: 'firstName', text: 'Benoit', start: 0, certaintyScore: 1 },
        { category: 'firstName', text: 'Nicolas', start: 29, certaintyScore: 1 },
        { category: 'firstName', text: 'Romain', start: 61, certaintyScore: 1 },
      ].map(annotationModule.lib.buildAnnotation);

      let anonymizer = buildAnonymizer(settings, annotations, seed);
      const anonymizedTextsFirstTime = annotations.map(anonymizer.anonymize);
      anonymizer = buildAnonymizer(settings, annotations, seed);
      const anonymizedTextsSecondTime = annotations.map(anonymizer.anonymize);
      anonymizer = buildAnonymizer(settings, annotations, seed);
      const anonymizedTextsThirdTime = annotations.map(anonymizer.anonymize);

      expect(anonymizedTextsFirstTime).toEqual(anonymizedTextsSecondTime);
      expect(anonymizedTextsFirstTime).toEqual(anonymizedTextsThirdTime);
    });
    it('should loop over the anonymization text if not enough are provided in the settings', () => {
      const anonymizedTexts = annotations.map(anonymizer.anonymize);

      expect(anonymizedTexts[2]).toEqual('[FIRST_NAME 4]');
    });
    it('should anonymize a text with a default string if the category is not in the settings', () => {
      const annotation = annotationModule.generator.generate({
        category: 'age',
        text: '25',
      });

      const anonymizedText = anonymizer.anonymize(annotation);

      expect(anonymizedText).toEqual('XXX');
    });
    it('should not anonymize a text if the category is set to not anonymized in the setting', () => {
      const annotation = annotationModule.generator.generate({
        category: 'professional',
        text: 'Leon',
      });
      const anonymizerWithNoAnomization = buildAnonymizer(
        settingsModule.lib.buildSettings({
          professional: { isAnonymized: false },
        }),
        [annotation],
        seed,
      );

      const anonymizedText = anonymizerWithNoAnomization.anonymize(annotation);

      expect(anonymizedText).toEqual('Leon');
    });
  });

  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  describe('extractReplacementTerms', () => {
    it('should extract replacementTerms mapping', () => {
      const annotations = [
        { category: 'firstName', text: 'Tintin', start: 0, certaintyScore: 1 },
        { category: 'lastName', text: 'Archibald', start: 7, certaintyScore: 1 },
        { category: 'firstName', text: 'Tournesol', start: 37, certaintyScore: 1 },
        { category: 'adresse', text: 'Chateau de Moulinsart', start: 45, certaintyScore: 1 },
        { category: 'firstName', text: 'Ottokar', start: 77, certaintyScore: 1 },
        { category: 'lastName', text: 'Haddock', start: 84, certaintyScore: 1 },
      ].map(annotationModule.lib.buildAnnotation);
      annotations[5] = annotationModule.lib.annotationLinker.link(annotations[5], annotations[1]);

      const anonymizer = buildAnonymizer(settings, annotations, seed);

      const replacementTerms = anonymizer.extractReplacementTerms();

      const expectedReplacementTerms = {
        firstName_tintin: { replacementTerm: '[FIRST_NAME 4]', instances: ['Tintin'], category: 'firstName' },
        lastName_archibald: {
          replacementTerm: '[LAST_NAME 1]',
          instances: ['Archibald', 'Haddock'],
          category: 'lastName',
        },
        firstName_tournesol: { replacementTerm: '[FIRST_NAME 5]', instances: ['Tournesol'], category: 'firstName' },
        'adresse_chateau de moulinsart': {
          replacementTerm: 'Chateau de Moulinsart',
          instances: ['Chateau de Moulinsart'],
          category: 'adresse',
        },
        firstName_ottokar: { replacementTerm: '[FIRST_NAME 3]', instances: ['Ottokar'], category: 'firstName' },
      };

      expect(replacementTerms).toEqual(expectedReplacementTerms);
    });
  });
});
