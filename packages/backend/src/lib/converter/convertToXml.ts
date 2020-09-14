import { courtDecisionType } from '@label/core';
import { XML_COURT_DECISION_TEXT_TAG, XML_COURT_DECISION_GLOBAL_TAG } from './xmlCourtDecisionConfig';

export { convertToXml };

function convertToXml(courtDecision: courtDecisionType): string {
  return `<?xml version="1.0" encoding="ISO-8859-1" ?>
<${XML_COURT_DECISION_GLOBAL_TAG}${courtDecision.header}
<${XML_COURT_DECISION_TEXT_TAG}>${courtDecision.text}</${XML_COURT_DECISION_TEXT_TAG}>
${courtDecision.footer}</${XML_COURT_DECISION_GLOBAL_TAG}>`;
}
