import { parse } from 'fast-xml-parser';
import { j2xParser } from 'fast-xml-parser';

const xmlParser = {
  parseXmlToJson(xml: string) {
    return parse(xml);
  },
  parseJsonToXml(json: object) {
    const parser = new j2xParser({});
    return parser.parse(json);
  },
};

export { xmlParser };
