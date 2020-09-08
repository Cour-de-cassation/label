import { convertFromXml } from './convertFromXml';

const xmlCourtDecision = `<header1>HEADER 1</header1>
<header2></header2>
<TEXTE_ARRET>COURT DECISION BODY</TEXTE_ARRET>
<footer1>FOOTER 1</footer1>`;

describe('convertFromXml', () => {
  it('should parse a xml court decision into our court decision format', () => {
    const courtDecision = convertFromXml(xmlCourtDecision);

    expect(courtDecision).toEqual({
      body: 'COURT DECISION BODY',
      footer: '<footer1>FOOTER 1</footer1>',
      header: '<header1>HEADER 1</header1><header2></header2>',
    });
  });
  it('should parse the header of a xml court decision', () => {
    const courtDecision = convertFromXml(xmlCourtDecision);

    expect(courtDecision.header).toEqual(
      '<header1>HEADER 1</header1><header2></header2>',
    );
  });
  it('should parse the footer of a xml court decision', () => {
    const courtDecision = convertFromXml(xmlCourtDecision);

    expect(courtDecision.footer).toEqual('<footer1>FOOTER 1</footer1>');
  });
  it('should parse the body of a xml court decision', () => {
    const courtDecision = convertFromXml(xmlCourtDecision);

    expect(courtDecision.body).toEqual('COURT DECISION BODY');
  });
});
