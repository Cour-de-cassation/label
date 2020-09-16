import { buildMongoId, courtDecisionType } from '@label/core';
import { converter } from '../../converter';
import { jurinetCourtDecisionType } from '../api';

export { oracleMapper };

const oracleMapper = { mapJurinetCourtDecisionToCourtDecision };

function mapJurinetCourtDecisionToCourtDecision(
  jurinetCourtDecision: jurinetCourtDecisionType,
): courtDecisionType {
  const parsedXmlCourtDecision = converter.convertFromXml(
    jurinetCourtDecision.xmlCourtDecision,
  );

  return {
    date: jurinetCourtDecision.date,
    footer: parsedXmlCourtDecision.footer,
    header: parsedXmlCourtDecision.header,
    _id: buildMongoId(),
    metadata: jurinetCourtDecision.metadata,
    oracleId: jurinetCourtDecision.oracleId,
    source: jurinetCourtDecision.source,
    text: parsedXmlCourtDecision.text,
  };
}
