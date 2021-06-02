import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { documentType } from '../documentType';

export { documentGenerator };

const documentGenerator: generatorType<documentType> = {
  generate: ({
    creationDate,
    decisionMetadata,
    documentNumber,
    externalId,
    _id,
    metadata,
    priority,
    publicationCategory,
    source,
    status,
    title,
    text,
    updateDate,
  } = {}) => ({
    creationDate: creationDate ? creationDate : new Date().getTime(),
    decisionMetadata: decisionMetadata
      ? decisionMetadata
      : {
          additionalTermsToAnnotate: '',
          boundDecisionDocumentNumbers: [],
          categoriesToOmit: [],
          chamberName: '',
          juridiction: '',
        },
    documentNumber: documentNumber ? documentNumber : Math.floor(Math.random() * 1000000),
    externalId: externalId ? externalId : `EXTERNAL_ID_${Math.random()}`,
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    metadata: metadata ? metadata : `METADATA_${Math.random()}`,
    priority: priority ? priority : 'low',
    publicationCategory: publicationCategory ? publicationCategory : [],
    source: source ? source : `SOURCE_${Math.random()}`,
    status: status ? status : 'free',
    title: title ? title : `TITLE_${Math.random()}`,
    text: text ? text : `TEXT_${Math.random()}`,
    updateDate: updateDate ? updateDate : new Date().getTime(),
  }),
};
