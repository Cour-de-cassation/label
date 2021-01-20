import { parse } from 'fast-xml-parser';
import { documentType, documentModule } from '@label/core';
import { jurinetCourtDecisionType } from '../api';

export { jurinetMapper };

const jurinetMapper = { mapJurinetCourtDecisionToDocument };

function mapJurinetCourtDecisionToDocument(
  jurinetCourtDecision: jurinetCourtDecisionType,
): documentType {
  const { number, chamber, juridiction, date, text } = parseJurinetXml(
    jurinetCourtDecision.xmlCourtDecision,
  );

  const title = computeTitleFromParsedCourtDecision({
    number,
    chamber,
    juridiction,
    date,
  });

  return documentModule.lib.buildDocument({
    creationDate: jurinetCourtDecision.date,
    documentId: parseInt(jurinetCourtDecision.oracleId),
    metadata: jurinetCourtDecision.metadata,
    source: jurinetCourtDecision.source,
    title,
    text,
  });
}

function parseJurinetXml(xml: string) {
  const XML_JURINET_COURT_DECISION_GLOBAL_TAG = 'DOCUMENT';
  const XML_JURINET_COURT_DECISION_JURIDICTION_TAG = 'JURIDICTION';
  const XML_JURINET_COURT_DECISION_CHAMBER_TAG = 'CHAMBRE';
  const XML_JURINET_COURT_DECISION_NUMBER_TAG = 'NUM_DECISION';
  const XML_JURINET_COURT_DECISION_DATE_TAG = 'DT_DECISION';
  const XML_JURINET_COURT_DECISION_TEXT_TAG = 'TEXTE_ARRET';

  const xmlJson = parse(xml) as {
    [XML_JURINET_COURT_DECISION_GLOBAL_TAG]: {
      [XML_JURINET_COURT_DECISION_JURIDICTION_TAG]: string;
      [XML_JURINET_COURT_DECISION_CHAMBER_TAG]: string;
      [XML_JURINET_COURT_DECISION_NUMBER_TAG]: string;
      [XML_JURINET_COURT_DECISION_DATE_TAG]: string;
      [XML_JURINET_COURT_DECISION_TEXT_TAG]: string;
    };
  };
  const juridiction =
    xmlJson[XML_JURINET_COURT_DECISION_GLOBAL_TAG][
      XML_JURINET_COURT_DECISION_JURIDICTION_TAG
    ];
  const chamber =
    xmlJson[XML_JURINET_COURT_DECISION_GLOBAL_TAG][
      XML_JURINET_COURT_DECISION_CHAMBER_TAG
    ];
  const number =
    xmlJson[XML_JURINET_COURT_DECISION_GLOBAL_TAG][
      XML_JURINET_COURT_DECISION_NUMBER_TAG
    ];
  const date =
    xmlJson[XML_JURINET_COURT_DECISION_GLOBAL_TAG][
      XML_JURINET_COURT_DECISION_DATE_TAG
    ];
  const text =
    xmlJson[XML_JURINET_COURT_DECISION_GLOBAL_TAG][
      XML_JURINET_COURT_DECISION_TEXT_TAG
    ];

  return { juridiction, chamber, number, date, text };
}

function computeTitleFromParsedCourtDecision({
  number,
  chamber,
  juridiction,
  date,
}: {
  number?: string;
  chamber?: string;
  juridiction?: string;
  date?: string;
}) {
  const readableNumber = `Décision n°${number}`;
  const readableChamber = convertChamberIntoReadableChamber(chamber);
  const title = [readableNumber, juridiction, readableChamber, date]
    .filter(Boolean)
    .join(' · ');
  return title;
}

function convertChamberIntoReadableChamber(chamber: string | undefined) {
  if (!chamber) {
    return '';
  }
  if (chamber && chamber.match(/CIV\.[1-3]/)) {
    return 'Chambre civile';
  } else if (chamber === 'SOC') {
    return 'Chambre sociale';
  }
  return '';
}
