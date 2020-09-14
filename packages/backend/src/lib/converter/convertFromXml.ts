import { pick } from 'lodash';
import { xmlParser } from './utils/xmlParser';
import { XML_COURT_DECISION_TAG } from './xmlCourtDecisionConfig';

export { convertFromXml };

type xmlJsonType = {
  [XML_COURT_DECISION_TAG]: string;
};

function convertFromXml(xml: string) {
  const xmlJson: xmlJsonType = xmlParser.parseXmlToJson(xml);
  const header = extractHeaders(xmlJson);
  const footer = extractFooters(xmlJson);
  const text = extractText(xmlJson);

  return {
    text,
    footer,
    header,
  };
}

function extractHeaders(xmlJson: xmlJsonType): string {
  const tagsList = Object.keys(xmlJson);
  const headerTagsList = tagsList.slice(
    0,
    tagsList.findIndex(tag => tag === XML_COURT_DECISION_TAG),
  );
  const jsonHeader = pick(xmlJson, headerTagsList);

  return xmlParser.parseJsonToXml(jsonHeader);
}

function extractFooters(xmlJson: xmlJsonType): string {
  const tagsList = Object.keys(xmlJson);
  const footerTagsList = tagsList.slice(
    1 + tagsList.findIndex(tag => tag === XML_COURT_DECISION_TAG),
  );
  const jsonFooter = pick(xmlJson, footerTagsList);

  return xmlParser.parseJsonToXml(jsonFooter);
}

function extractText(xmlJson: xmlJsonType): string {
  return xmlJson[XML_COURT_DECISION_TAG];
}
