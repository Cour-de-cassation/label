import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { documentType } from '../documentType';

export { documentGenerator };

const documentGenerator: generatorType<documentType> = {
  generate: ({ creationDate, documentId, _id, metadata, source, status, title, text, updateDate } = {}) => ({
    creationDate: creationDate ? creationDate : new Date(),
    documentId: documentId ? documentId : 0,
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    metadata: metadata ? metadata : `METADATA_${Math.random()}`,
    source: source ? source : `SOURCE_${Math.random()}`,
    status: status ? status : 'free',
    title: title ? title : `TITLE_${Math.random()}`,
    text: text ? text : `TEXT_${Math.random()}`,
    updateDate: updateDate ? updateDate : new Date().getTime(),
  }),
};
