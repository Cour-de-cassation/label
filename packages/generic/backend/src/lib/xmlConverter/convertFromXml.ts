import { pick } from 'lodash';
import { xmlParser } from './utils/xmlParser';
import {
  XML_COURT_DECISION_TEXT_TAG,
  XML_COURT_DECISION_GLOBAL_TAG,
} from './xmlCourtDecisionConfig';

export { convertFromXml };

type jurinetXmlJsonType = {
  [XML_COURT_DECISION_GLOBAL_TAG]: jurinetContentJsonType;
};

type jurinetContentJsonType = {
  [XML_COURT_DECISION_TEXT_TAG]: string;
};

function convertFromXml(xml: string) {
  const xmlJson = xmlParser.parseXmlToJson(xml) as jurinetXmlJsonType;
  const jsonContent = xmlJson[XML_COURT_DECISION_GLOBAL_TAG];
  const header = extractHeaders(jsonContent);
  const footer = extractFooters(jsonContent);
  const text = extractText(jsonContent);

  return {
    text,
    footer,
    header,
  };
}

function extractHeaders(xmlJson: jurinetContentJsonType): string {
  const tagsList = Object.keys(xmlJson);
  const headerTagsList = tagsList.slice(
    0,
    tagsList.findIndex((tag) => tag === XML_COURT_DECISION_TEXT_TAG),
  );
  const jsonHeader = pick(xmlJson, headerTagsList);

  return xmlParser.parseJsonToXml(jsonHeader);
}

function extractFooters(xmlJson: jurinetContentJsonType): string {
  const tagsList = Object.keys(xmlJson);
  const footerTagsList = tagsList.slice(
    1 + tagsList.findIndex((tag) => tag === XML_COURT_DECISION_TEXT_TAG),
  );
  const jsonFooter = pick(xmlJson, footerTagsList);

  return xmlParser.parseJsonToXml(jsonFooter);
}

function extractText(xmlJson: jurinetContentJsonType): string {
  return xmlJson[XML_COURT_DECISION_TEXT_TAG];
}
