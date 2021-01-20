import { omit } from 'lodash';
import { jurinetCourtDecisionType } from '../api';
import { jurinetMapper } from './jurinetMapper';

const jurinetCourtDecision: jurinetCourtDecisionType = {
  date: new Date(),
  metadata: 'METADATA',
  oracleId: '0',
  source: 'jurinet',
  xmlCourtDecision: `<DOCUMENT>
<NUM_DECISION>12345</NUM_DECISION>
<CHAMBRE>CIV.2</CHAMBRE>
<DT_DECISION>17/04/1995</DT_DECISION>
<JURIDICTION>Cour de cassation</JURIDICTION>
<TEXTE_ARRET>COURT DECISION TEXT</TEXTE_ARRET>
<footer1>FOOTER 1</footer1></DOCUMENT>`,
};

describe('jurinetMapper', () => {
  describe('mapJurinetCourtDecisionToDocument', () => {
    it('should convert the jurinet court decision into a document', () => {
      const document = jurinetMapper.mapJurinetCourtDecisionToDocument(
        jurinetCourtDecision,
      );

      expect(omit(document, ['_id', 'locked'])).toEqual({
        creationDate: jurinetCourtDecision.date,
        metadata: jurinetCourtDecision.metadata,
        documentId: parseInt(jurinetCourtDecision.oracleId),
        source: jurinetCourtDecision.source,
        status: 'free',
        title:
          'Décision n°12345 · Cour de cassation · Chambre civile · 17/04/1995',
        text: 'COURT DECISION TEXT',
      });
    });
  });
});
