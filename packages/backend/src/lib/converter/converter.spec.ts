import { converter } from './converter';

describe('converter', () => {
  describe('converter.convertToXml(converter.convertFromXml(xml))', () => {
    it('should be identity', () => {
      const xmlCourtDecision = `<header1>HEADER 1</header1>
<header2></header2>
<TEXTE_ARRET>COURT DECISION BODY</TEXTE_ARRET>
<footer1>FOOTER 1</footer1>`;

      const generatedXmlCourtDecision = converter.convertToXml(
        converter.convertFromXml(xmlCourtDecision),
      );

      expect(generatedXmlCourtDecision)
        .toEqual(`<?xml version="1.0" encoding="ISO-8859-1" ?>
<header1>HEADER 1</header1><header2></header2>
<TEXTE_ARRET>COURT DECISION BODY</TEXTE_ARRET>
<footer1>FOOTER 1</footer1>`);
    });
  });
  describe('convertFromXml(convertToXml)', () => {
    it('should be identity', () => {
      const courtDecision = {
        body: 'COURT DECISION BODY',
        footer: '<footer1>FOOTER 1</footer1>',
        header: '<header1>HEADER 1</header1><header2></header2>',
      };

      const generatedCourtDecision = converter.convertFromXml(
        converter.convertToXml(courtDecision),
      );

      expect(generatedCourtDecision).toEqual({
        body: 'COURT DECISION BODY',
        footer: '<footer1>FOOTER 1</footer1>',
        header: '<header1>HEADER 1</header1><header2></header2>',
      });
    });
  });
});
