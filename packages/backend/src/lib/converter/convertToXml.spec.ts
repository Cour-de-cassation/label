import { convertToXml } from './convertToXml';

describe('convertToXml', () => {
  it('should convert a court decision to a xml court decision', () => {
    const courtDecision = {
      body: 'COURT DECISION BODY',
      footer: '<footer1>FOOTER 1</footer1>',
      header: '<header1>HEADER 1</header1><header2></header2>',
    };
    const xmlStr = `<header1>HEADER 1</header1>
      <header2></header2>
      <TEXTE_ARRET>COURT DECISION BODY</TEXTE_ARRET>
      <footer1>FOOTER 1</footer1>`;

    const xml = convertToXml(courtDecision);

    expect(xml).toEqual(`<?xml version="1.0" encoding="ISO-8859-1" ?>
<header1>HEADER 1</header1><header2></header2>
<TEXTE_ARRET>COURT DECISION BODY</TEXTE_ARRET>
<footer1>FOOTER 1</footer1>`);
  });
});
