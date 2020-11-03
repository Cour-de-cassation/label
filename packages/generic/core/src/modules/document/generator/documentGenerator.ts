import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { documentType } from '../documentType';

export { documentGenerator };

const documentGenerator: generatorType<documentType> = {
  generate: ({ creationDate, documentId, _id, metadata, source, title, text } = {}) => ({
    creationDate: creationDate ? creationDate : new Date(),
    documentId: documentId ? documentId : `DOCUMENT_ID_${Math.random()}`,
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    metadata: metadata ? metadata : `METADATA_${Math.random()}`,
    source: source ? source : `SOURCE_${Math.random()}`,
    title: title ? title : `TITLE_${Math.random()}`,
    text: text ? text : `TEXT_${Math.random()}`,
  }),
};
