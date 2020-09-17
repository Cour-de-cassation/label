import { courtDecisionModule } from '@label/core';
import { xmlConverter } from './xmlConverter';

describe('xmlConverter', () => {
  describe('xmlConverter.convertToXml(xmlConverter.convertFromXml(xml))', () => {
    it('should be identity', () => {
      const xmlCourtDecision = `<DOCUMENT><header1>HEADER 1</header1>
<header2></header2>
<TEXTE_ARRET>COURT DECISION BODY</TEXTE_ARRET>
<footer1>FOOTER 1</footer1></DOCUMENT>`;

      const generatedXmlCourtDecision = xmlConverter.convertToXml(
        courtDecisionModule.generator.generate(
          xmlConverter.convertFromXml(xmlCourtDecision),
        ),
      );

      expect(generatedXmlCourtDecision)
        .toEqual(`<?xml version="1.0" encoding="ISO-8859-1" ?>
<DOCUMENT><header1>HEADER 1</header1><header2></header2>
<TEXTE_ARRET>COURT DECISION BODY</TEXTE_ARRET>
<footer1>FOOTER 1</footer1></DOCUMENT>`);
    });
  });
  describe('convertFromXml(convertToXml)', () => {
    it('should be identity', () => {
      const courtDecision = {
        text: 'COURT DECISION BODY',
        footer: '<footer1>FOOTER 1</footer1>',
        header: '<header1>HEADER 1</header1><header2></header2>',
      };

      const generatedCourtDecision = xmlConverter.convertFromXml(
        xmlConverter.convertToXml(
          courtDecisionModule.generator.generate(courtDecision),
        ),
      );

      expect(generatedCourtDecision).toEqual({
        text: 'COURT DECISION BODY',
        footer: '<footer1>FOOTER 1</footer1>',
        header: '<header1>HEADER 1</header1><header2></header2>',
      });
    });
  });
});
