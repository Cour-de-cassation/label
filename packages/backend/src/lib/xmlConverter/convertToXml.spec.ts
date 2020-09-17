import { courtDecisionGenerator } from '@label/core';
import { convertToXml } from './convertToXml';

describe('convertToXml', () => {
  it('should convert a court decision to a xml court decision', () => {
    const courtDecision = courtDecisionGenerator.generate({
      text: 'COURT DECISION TEXT',
      footer: '<footer1>FOOTER 1</footer1>',
      header: '<header1>HEADER 1</header1><header2></header2>',
    });

    const xml = convertToXml(courtDecision);

    expect(xml).toEqual(`<?xml version="1.0" encoding="ISO-8859-1" ?>
<DOCUMENT><header1>HEADER 1</header1><header2></header2>
<TEXTE_ARRET>COURT DECISION TEXT</TEXTE_ARRET>
<footer1>FOOTER 1</footer1></DOCUMENT>`);
  });
});
