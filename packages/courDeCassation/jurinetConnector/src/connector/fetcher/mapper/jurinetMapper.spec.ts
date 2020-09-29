import { omit } from 'lodash';
import { jurinetCourtDecisionType } from '../api';
import { jurinetMapper } from './jurinetMapper';

const jurinetCourtDecision: jurinetCourtDecisionType = {
  date: new Date(),
  metadata: 'METADATA',
  oracleId: 'ORACLE_ID',
  source: 'jurinet',
  xmlCourtDecision: `<DOCUMENT><header1>HEADER 1</header1>
<header2></header2>
<TEXTE_ARRET>COURT DECISION TEXT</TEXTE_ARRET>
<footer1>FOOTER 1</footer1></DOCUMENT>`,
};

describe('jurinetMapper', () => {
  describe('mapJurinetCourtDecisionToDocument', () => {
    it('should convert the jurinet court decision into a document', () => {
      const document = jurinetMapper.mapJurinetCourtDecisionToDocument(
        jurinetCourtDecision,
      );

      expect(omit(document, '_id')).toEqual({
        creationDate: jurinetCourtDecision.date,
        metadata: jurinetCourtDecision.metadata,
        documentId: jurinetCourtDecision.oracleId,
        source: jurinetCourtDecision.source,
        text: 'COURT DECISION TEXT',
      });
    });
  });
});
