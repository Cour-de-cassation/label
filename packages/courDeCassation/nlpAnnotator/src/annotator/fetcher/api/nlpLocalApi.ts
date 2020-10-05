import { promises as fs } from 'fs';
import { nlpApiType, nlpAnnotationsType } from './nlpApiType';

export { nlpLocalApi };

const pathToNlpAnnotations = './storage/';

const nlpLocalApi: nlpApiType = {
  async fetchNlpAnnotations(document) {
    return JSON.parse(
      await fs.readFile(`${pathToNlpAnnotations}${document.documentId}.json`, {
        encoding: 'latin1',
      }),
    ) as nlpAnnotationsType;
  },
};
