import { generatorType } from '../../../types';
import { idModule } from '../../id';
import { annotationReportType } from '../annotationReportType';

export { annotationReportGenerator };

const annotationReportGenerator: generatorType<annotationReportType> = {
  generate: ({ checklist, documentId, _id } = {}) => ({
    checklist: checklist
      ? checklist
      : [
          {
            checkType: `CATEGORIES_${Math.random()}`,
            message:
              "L'annotation 'Test' est présente dans différentes catégories: ['Magistrat/Greffier', 'Personne physique']",
            short_message: "Test ['Magistrat/Greffier', 'Personne physique'] ?",
            entities: [
              {
                text: 'Test',
                start: Math.random(),
                category: `personnePhysique_${Math.random()}`,
                source: 'postprocess',
                score: 1.0,
                entityId: `personnePhysique_test_${Math.random()}`,
                end: Math.random(),
              },
              {
                text: 'Test',
                start: Math.random(),
                category: `professionnelMagistratGreffier_${Math.random()}`,
                source: 'postprocess',
                score: 1.0,
                entityId: `professionnelMagistratGreffier_test_${Math.random()}`,
                end: Math.random(),
              },
            ],
            sentences: [
              {
                start: Math.random(),
                end: Math.random(),
              },
            ],
            metadata_text: [`metadata_text_${Math.random()}`, `metadata_text_${Math.random()}`],
          },
        ],
    documentId: documentId ? idModule.lib.buildId(documentId) : idModule.lib.buildId(),
    _id: _id ? idModule.lib.buildId(_id) : idModule.lib.buildId(),
  }),
};
