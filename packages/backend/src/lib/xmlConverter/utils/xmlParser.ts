import { parse } from 'fast-xml-parser';
import { j2xParser } from 'fast-xml-parser';

const xmlParser = {
  parseXmlToJson(xml: string): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return parse(xml);
  },
  parseJsonToXml(json: any): string {
    const parser = new j2xParser({});
    return parser.parse(json) as string;
  },
};

export { xmlParser };
