import { documentGenerator } from '../generator';
import { computeCaseNumber } from './computeCaseNumber';

describe('computeCaseNumber', () => {
  const documentNumber = 12345;
  const boundDocumentNumber = 54321;
  const otherBoundDocumentNumber = 98765;
  it('should return the first boundDocumentNumber', () => {
    const document = documentGenerator.generate({
      decisionMetadata: {
        additionalTermsToAnnotate: '',
        appealNumber: '',
        boundDecisionDocumentNumbers: [boundDocumentNumber, otherBoundDocumentNumber],
        chamberName: '',
        jurisdiction: '',
        solution: '',
        session: '',
        categoriesToOmit: [],
        occultationBlock: undefined,
      },
      documentNumber,
    });

    const caseNumber = computeCaseNumber(document);

    expect(caseNumber).toBe(boundDocumentNumber);
  });
  it('should return the documentNumber if no bound document number found', () => {
    const document = documentGenerator.generate({
      decisionMetadata: {
        additionalTermsToAnnotate: '',
        appealNumber: '',
        boundDecisionDocumentNumbers: [],
        chamberName: '',
        jurisdiction: '',
        solution: '',
        session: '',
        categoriesToOmit: [],
        occultationBlock: undefined,
      },
      documentNumber,
    });

    const caseNumber = computeCaseNumber(document);

    expect(caseNumber).toBe(documentNumber);
  });
});
