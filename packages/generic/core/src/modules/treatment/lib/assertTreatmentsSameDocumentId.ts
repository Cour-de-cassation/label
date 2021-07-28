import { idModule } from '../../id';
import { treatmentType } from '../treatmentType';
import { computeTreatmentIdsText } from './computeTreatmentIdsText';

export { assertTreatmentsSameDocumentId };

function assertTreatmentsSameDocumentId(treatments: treatmentType[]) {
  if (treatments.length < 2) {
    return;
  }

  const documentId = treatments[0].documentId;
  for (let i = 1, l = treatments.length; i < l; i++) {
    if (!idModule.lib.equalId(documentId, treatments[i].documentId)) {
      throw new Error(`The treatments ${computeTreatmentIdsText(treatments)} are not on the same document`);
    }
  }
}
