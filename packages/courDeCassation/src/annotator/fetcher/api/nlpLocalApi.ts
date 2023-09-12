import { promises as fs } from 'fs';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { buildNlpLocalApi };

const pathToNlpAnnotations = './storage/annotations/';

function buildNlpLocalApi(): nlpApiType {
  return {
    async fetchNlpAnnotations(document) {
      const annotations = JSON.parse(
        await fs.readFile(
          `${pathToNlpAnnotations}${document.documentNumber}.json`,
          {
            encoding: 'utf8',
          },
        ),
      ) as nlpAnnotationsType;

      return annotations;
    },
    async fetchNlpLoss() {
      return 0;
    },
  };
}
