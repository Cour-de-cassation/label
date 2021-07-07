import { generatorType } from '../../../types';
import { annotationsDiffModule } from '../../annotationsDiff';
import { idModule } from '../../id';
import { treatmentType } from '../treatmentType';

export { treatmentGenerator };

const treatmentGenerator: generatorType<treatmentType> = {
  generate: ({
    _id,
    addedAnnotationsCount,
    annotationsDiff,
    deletedAnnotationsCount,
    documentId,
    duration,
    lastUpdateDate,
    modifiedAnnotationsCount,
    order,
    resizedBiggerAnnotationsCount,
    resizedSmallerAnnotationsCount,
    source,
  } = {}) => ({
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
    addedAnnotationsCount: addedAnnotationsCount ? addedAnnotationsCount : { sensitive: 0, other: 0 },
    annotationsDiff: annotationsDiff ? annotationsDiff : annotationsDiffModule.generator.generate(),
    deletedAnnotationsCount: deletedAnnotationsCount ? deletedAnnotationsCount : { anonymised: 0, other: 0 },
    documentId: documentId ? idModule.lib.buildId(documentId) : idModule.lib.buildId(),
    duration: duration ? duration : 0,
    lastUpdateDate: lastUpdateDate ? lastUpdateDate : new Date().getTime(),
    modifiedAnnotationsCount: modifiedAnnotationsCount
      ? modifiedAnnotationsCount
      : { nonAnonymisedToSensitive: 0, other: 0, anonymisedToNonAnonymised: 0 },
    order: order ? order : 0,
    resizedBiggerAnnotationsCount: resizedBiggerAnnotationsCount
      ? resizedBiggerAnnotationsCount
      : { sensitive: 0, other: 0 },
    resizedSmallerAnnotationsCount: resizedSmallerAnnotationsCount
      ? resizedSmallerAnnotationsCount
      : { anonymised: 0, other: 0 },
    source: source ? source : 'NLP',
  }),
};
