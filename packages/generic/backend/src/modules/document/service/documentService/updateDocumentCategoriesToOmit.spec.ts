import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { updateDocumentCategoriesToOmit } from './updateDocumentCategoriesToOmit'

describe('updateDocumentCategoriesToOmit', () => {
  const documentRepository = buildDocumentRepository();

  it('should update document categoriesToOmit', async () => {
    const document = documentModule.generator.generate({
      decisionMetadata: {
        appealNumber: "",
        additionalTermsToAnnotate: "",
        boundDecisionDocumentNumbers: [],
        categoriesToOmit: ["categorie1", "categorie2"],
        chamberName: "",
        civilCaseCode: "",
        civilMatterCode: "",
        criminalCaseCode: "",
        date: 0,
        jurisdiction: "",
        occultationBlock: 0,
        NACCode: "",
        endCaseCode: "",
        parties: [],
        session: "",
        solution: "",
      }
    });
    await documentRepository.insert(document);

    const updatedDocument = await updateDocumentCategoriesToOmit(document._id, ["categorie3", "category4"]);

    expect(updatedDocument.decisionMetadata.categoriesToOmit).toEqual(["categorie3", "category4"]);
  });
});
