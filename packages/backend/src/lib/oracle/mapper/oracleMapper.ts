import { buildMongoId, courtDecisionType } from '@label/core';
import { xmlConverter } from '../../xmlConverter';
import { jurinetCourtDecisionType } from '../api';

export { oracleMapper };

const oracleMapper = { mapJurinetCourtDecisionToCourtDecision };

function mapJurinetCourtDecisionToCourtDecision(
  jurinetCourtDecision: jurinetCourtDecisionType,
): courtDecisionType {
  const parsedXmlCourtDecision = xmlConverter.convertFromXml(
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
