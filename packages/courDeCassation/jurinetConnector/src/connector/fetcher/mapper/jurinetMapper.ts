import { parse } from 'fast-xml-parser';
import { buildMongoId, documentType, documentModule } from '@label/core';
import { jurinetCourtDecisionType } from '../api';

export { jurinetMapper };

const jurinetMapper = { mapJurinetCourtDecisionToDocument };

function mapJurinetCourtDecisionToDocument(
  jurinetCourtDecision: jurinetCourtDecisionType,
): documentType {
  const parsedXmlCourtDecision = parseJurinetXml(
    jurinetCourtDecision.xmlCourtDecision,
  );

  return documentModule.lib.buildDocument({
    creationDate: jurinetCourtDecision.date,
    documentId: jurinetCourtDecision.oracleId,
    metadata: jurinetCourtDecision.metadata,
    source: jurinetCourtDecision.source,
    text: parsedXmlCourtDecision,
  });
}

function parseJurinetXml(xml: string) {
  const XML_JURINET_COURT_DECISION_GLOBAL_TAG = 'DOCUMENT';
  const XML_JURINET_COURT_DECISION_TEXT_TAG = 'TEXTE_ARRET';

  const xmlJson = parse(xml) as {
    [XML_JURINET_COURT_DECISION_GLOBAL_TAG]: {
      [XML_JURINET_COURT_DECISION_TEXT_TAG]: string;
    };
  };

  return xmlJson[XML_JURINET_COURT_DECISION_GLOBAL_TAG][
    XML_JURINET_COURT_DECISION_TEXT_TAG
  ];
}
