import { generatorType } from '@label/core';
import { jurinetCourtDecisionType } from '../../fetcher/api';

export { jurinetCourtDecisionGenerator };

const jurinetCourtDecisionGenerator: generatorType<jurinetCourtDecisionType> = {
  generate: ({ date, metadata, oracleId, source, xmlCourtDecision } = {}) => ({
    date: date ? date : new Date(),
    metadata: metadata ? metadata : `METADATA_${Math.random()}`,
    oracleId: oracleId ? oracleId : `ORACLE_ID_${Math.random()}`,
    source: source ? source : 'jurinet',
    xmlCourtDecision: xmlCourtDecision
      ? xmlCourtDecision
      : generateRandomXmlCourtDecision(),
  }),
};

function generateRandomXmlCourtDecision() {
  return `<DOCUMENT><header1>HEADER 1</header1>
<header2>HEADER 2</header2>
<TEXTE_ARRET>COURT DECISION TEXT N°${Math.random()} TO_ANNOTE END</TEXTE_ARRET>
<footer1>A LONG FOOTER</footer1></DOCUMENT>`;
}
