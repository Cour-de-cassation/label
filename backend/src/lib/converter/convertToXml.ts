import { courtDecisionType } from '../../modules/courtDecision';
import { XML_COURT_DECISION_TAG } from './xmlCourtDecisionConfig';

export { convertToXml };

function convertToXml(courtDecision: courtDecisionType): string {
  return `<?xml version="1.0" encoding="ISO-8859-1" ?>
${courtDecision.header}
<${XML_COURT_DECISION_TAG}>${courtDecision.body}</${XML_COURT_DECISION_TAG}>
${courtDecision.footer}`;
}
