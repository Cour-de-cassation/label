import { documentModule } from '..';
import { documentGenerator } from '../generator';
import { computeCaseNumber } from './computeCaseNumber';

describe('computeCaseNumber', () => {
  const documentNumber = 12345;
  const boundDocumentNumber = 54321;
  const otherBoundDocumentNumber = 98765;
  const decisionDate = new Date().getTime();
  it('should return the first boundDocumentNumber', () => {
    const document = documentGenerator.generate({
      decisionMetadata: documentModule.decisionMetadataGenerator.generate({
        additionalTermsToAnnotate: '',
        appealNumber: '',
        boundDecisionDocumentNumbers: [boundDocumentNumber, otherBoundDocumentNumber],
        chamberName: '',
        criminalCaseCode: '',
        civilCaseCode: '',
        civilMatterCode: '',
        date: decisionDate,
        jurisdiction: '',
        NACCode: '',
        endCaseCode: '',
        solution: '',
        session: '',
        categoriesToOmit: [],
        parties: [],
        occultationBlock: undefined,
      }),
      documentNumber,
    });

    const caseNumber = computeCaseNumber(document);

    expect(caseNumber).toBe(boundDocumentNumber);
  });
  it('should return the documentNumber if no bound document number found', () => {
    const document = documentGenerator.generate({
      decisionMetadata: documentModule.decisionMetadataGenerator.generate({
        additionalTermsToAnnotate: '',
        appealNumber: '',
        boundDecisionDocumentNumbers: [],
        chamberName: '',
        criminalCaseCode: '',
        civilCaseCode: '',
        civilMatterCode: '',
        date: decisionDate,
        jurisdiction: '',
        NACCode: '',
        endCaseCode: '',
        solution: '',
        session: '',
        categoriesToOmit: [],
        parties: [],
        occultationBlock: undefined,
      }),
      documentNumber,
    });

    const caseNumber = computeCaseNumber(document);

    expect(caseNumber).toBe(documentNumber);
  });
});
