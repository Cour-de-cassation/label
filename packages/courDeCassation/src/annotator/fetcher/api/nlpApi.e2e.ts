import { documentModule, settingsModule } from '@label/core';
import { nlpApi } from './nlpApi';

describe('nlpApi', () => {
  it('should fetch the annotations of a given document', async () => {
    const settings = settingsModule.lib.buildSettings({
      personnePhysique: {},
      adresse: {},
    });
    const document = documentModule.generator.generate({
      source: 'jurinet',
      text: 'François Dubois est Français. Il habite avenue des champs Élysée.',
    });

    const nlpAnnotation = await nlpApi.fetchNlpAnnotations(settings, document);

    expect(nlpAnnotation.entities).toEqual([
      {
        text: 'François',
        start: 0,
        end: 8,
        label: 'personnePhysique',
        source: 'NER model',
      },
      {
        text: 'Dubois',
        start: 9,
        end: 15,
        label: 'personnePhysique',
        source: 'NER model',
      },
      {
        text: 'avenue des champs Élysée',
        start: 40,
        end: 64,
        label: 'adresse',
        source: 'NER model',
      },
    ]);
  });

  it('should not fetch the annotations of unwanted category of a given document', async () => {
    const settings = settingsModule.lib.buildSettings({
      adresse: {},
    });
    const document = documentModule.generator.generate({
      source: 'jurinet',
      text: 'François Dubois est Français. Il habite avenue des champs Élysée.',
    });

    const nlpAnnotation = await nlpApi.fetchNlpAnnotations(settings, document);

    expect(nlpAnnotation.entities).toEqual([
      {
        text: 'avenue des champs Élysée',
        start: 40,
        end: 64,
        label: 'adresse',
        source: 'NER model',
      },
    ]);
  });
});
