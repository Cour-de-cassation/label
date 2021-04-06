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
    addedAnnotationsCount: addedAnnotationsCount ? addedAnnotationsCount : 0,
    annotationsDiff: annotationsDiff ? annotationsDiff : annotationsDiffModule.generator.generate(),
    deletedAnnotationsCount: deletedAnnotationsCount ? deletedAnnotationsCount : 0,
    documentId: documentId ? idModule.lib.buildId(documentId) : idModule.lib.buildId(),
    duration: duration ? duration : 0,
    lastUpdateDate: lastUpdateDate ? lastUpdateDate : new Date().getTime(),
    modifiedAnnotationsCount: modifiedAnnotationsCount ? modifiedAnnotationsCount : 0,
    order: order ? order : 0,
    resizedBiggerAnnotationsCount: resizedBiggerAnnotationsCount ? resizedBiggerAnnotationsCount : 0,
    resizedSmallerAnnotationsCount: resizedSmallerAnnotationsCount ? resizedSmallerAnnotationsCount : 0,
    source: source ? source : 'NLP',
  }),
};
