import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { documentType } from '../documentType';

export { documentGenerator };

const documentGenerator: generatorType<documentType> = {
  generate: ({
    creationDate,
    criticity,
    decisionMetadata,
    documentNumber,
    externalId,
    _id,
    metadata,
    priority,
    publicationCategory,
    reviewStatus,
    source,
    status,
    title,
    text,
    updateDate,
  } = {}) => ({
    creationDate: creationDate ? creationDate : new Date().getTime(),
    criticity: criticity ? criticity : 1,
    decisionMetadata: decisionMetadata
      ? decisionMetadata
      : {
          additionalTermsToAnnotate: '',
          appealNumber: '',
          boundDecisionDocumentNumbers: [],
          categoriesToOmit: [],
          chamberName: '',
          date: new Date().getTime(),
          jurisdiction: '',
          occultationBlock: undefined,
          session: '',
          solution: '',
        },
    documentNumber: documentNumber ? documentNumber : Math.floor(Math.random() * 1000000),
    externalId: externalId ? externalId : `EXTERNAL_ID_${Math.random()}`,
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    metadata: metadata ? metadata : `METADATA_${Math.random()}`,
    priority: priority ? priority : 'low',
    publicationCategory: publicationCategory ? publicationCategory : [],
    reviewStatus: reviewStatus || { hasBeenAmended: false, viewerNames: [] },
    source: source ? source : `SOURCE_${Math.random()}`,
    status: status ? status : 'free',
    title: title ? title : `TITLE_${Math.random()}`,
    text: text ? text : `TEXT_${Math.random()}`,
    updateDate: updateDate ? updateDate : new Date().getTime(),
  }),
};
