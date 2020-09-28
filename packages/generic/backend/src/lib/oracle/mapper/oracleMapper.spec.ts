import { omit } from 'lodash';
import { jurinetCourtDecisionType } from '../api';
import { oracleMapper } from './oracleMapper';

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

describe('oracleMapper', () => {
  describe('mapJurinetCourtDecisionToCourtDecision', () => {
    it('should convert the jurinet court decision into a court decision', () => {
      const courtDecision = oracleMapper.mapJurinetCourtDecisionToCourtDecision(
        jurinetCourtDecision,
      );

      expect(omit(courtDecision, '_id')).toEqual({
        date: jurinetCourtDecision.date,
        footer: '<footer1>FOOTER 1</footer1>',
        header: '<header1>HEADER 1</header1><header2></header2>',
        metadata: jurinetCourtDecision.metadata,
        oracleId: jurinetCourtDecision.oracleId,
        source: jurinetCourtDecision.source,
        text: 'COURT DECISION TEXT',
      });
    });
  });
});
