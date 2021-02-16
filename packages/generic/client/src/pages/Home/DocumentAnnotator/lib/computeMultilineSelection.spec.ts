import { computeMultilineSelection } from './computeMultilineSelection';

describe('computeMultilineSelection', () => {
  it('should compute the right multiline selection', () => {
    const anchorNodeValue = ' \tREJETTE le pourvoi ;';
    const focusNodeValue =
      " \tEt attendu que le premier président, qui n'était pas tenu de s'expliquer sur chacun des critères de l'article 10 de la loi du 31 décembre 1971 ni de suivre les parties dans le détail de leur argumentation, faisant état des critères déterminants de son estimation, a souverainement fixé le montant des honoraires dûs et a ainsi légalement justifié sa décision ; ";
    const selectionText =
      'légalement justifié sa décision ;\n\n71\n\t\n\n72\n\t\n\nPAR CES MOTIFS :\n\n73\n\t\n\n74\n\t\n\nREJETTE le pourvoi';
    const current = {
      index: 5178,
      text:
        " \tEt attendu que le premier président, qui n'était pas tenu de s'expliquer sur chacun des critères de l'article 10 de la loi du 31 décembre 1971 ni de suivre les parties dans le détail de leur argumentation, faisant état des critères déterminants de son estimation, a souverainement fixé le montant des honoraires dûs et a ainsi légalement justifié sa décision ; ",
    };
    const after = [
      {
        index: 5542,
        text: ' \t',
      },
      {
        index: 5545,
        text: ' \tPAR CES MOTIFS :',
      },
      {
        index: 5564,
        text: ' ',
      },
      {
        index: 5566,
        text: ' \tREJETTE le pourvoi ;',
      },
      {
        index: 5589,
        text: ' ',
      },
      {
        index: 5591,
        text: ' \tCondamne M. ',
      },
    ];
    const before = [
      {
        index: 4941,
        text:
          " ne pouvait valablement s'engager pour le compte de son fils à régler un  honoraire de résultat, le premier président a, par ces seuls motifs, légalement justifié sa décision de ne pas accorder un honoraire conventionnel de résultat ;",
      },
      {
        index: 5176,
        text: ' ',
      },
    ];

    const multilineSelection = computeMultilineSelection(
      selectionText,
      { before, current, after },
      anchorNodeValue,
      focusNodeValue,
    );

    expect(multilineSelection).toEqual([
      {
        index: 5507,
        text: 'légalement justifié sa décision ;',
      },
      {
        index: 5547,
        text: 'PAR CES MOTIFS :',
      },
      {
        index: 5568,
        text: 'REJETTE le pourvoi',
      },
    ]);
  });
});
