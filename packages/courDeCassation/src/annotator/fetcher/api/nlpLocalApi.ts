import { promises as fs } from 'fs';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { nlpLocalApi };

const pathToNlpAnnotations = './storage/annotations/';

const nlpLocalApi: nlpApiType = {
  async fetchNlpAnnotations(settings, document) {
    const annotations = JSON.parse(
      await fs.readFile(`${pathToNlpAnnotations}${document.documentId}.json`, {
        encoding: 'latin1',
      }),
    ) as nlpAnnotationsType;

    return {
      ...annotations,
      entities: annotations.entities.filter(entity =>
        Object.keys(settings).includes(entity.label),
      ),
    };
  },
};
