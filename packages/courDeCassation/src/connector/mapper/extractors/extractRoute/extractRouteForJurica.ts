import { documentType } from '@label/core';
import { transformLetterCodeToDec } from '.';
import * as fs from 'fs';

export { extractRouteForJurica };

function extractRouteForJurica({
  NACCode,
  endCaseCode,
}: {
  session: documentType['decisionMetadata']['session'];
  solution: documentType['decisionMetadata']['solution'];
  publicationCategory: documentType['publicationCategory'];
  chamberId: string;
  civilMatterCode: documentType['decisionMetadata']['civilMatterCode'];
  civilCaseCode: documentType['decisionMetadata']['civilCaseCode'];
  criminalCaseCode: documentType['decisionMetadata']['criminalCaseCode'];
  NACCode: documentType['decisionMetadata']['NACCode'];
  endCaseCode: documentType['decisionMetadata']['endCaseCode'];
}): documentType['route'] {
  const endCaseCodeCsv = fs.readFileSync('./static/endCaseRoutes.csv', {
    encoding: 'utf8',
  }) as string;
  const endCaseCodeData = {} as Array<any>;

  endCaseCodeCsv.split('\n').forEach((line) => {
    const l = line.split(',');
    if (l[1]) {
      endCaseCodeData[
        transformLetterCodeToDec({ code: l[0] })
      ] = l[1].toLowerCase() as documentType['route'];
    }
  });

  const NACCodeCsv = fs.readFileSync('./static/NACCodeRoutes.csv', {
    encoding: 'utf8',
  }) as string;
  const NACCodeData = {} as Array<any>;

  NACCodeCsv.split('\n').forEach((line) => {
    const l = line.split(',');
    if (l[1]) {
      NACCodeData[
        transformLetterCodeToDec({ code: l[0] })
      ] = l[1].toLowerCase() as documentType['route'];
    }
  });

  const decEndCaseCode: number = transformLetterCodeToDec({
    code: endCaseCode,
  });

  // Les codes de fin d'affaire 11A à 22X inclus + 33A à 33C priment sur les codes NAC
  // Les codes NAC priment sur les codes de fin d'affaire à partir du code de fin d'affaire 33D
  if (
    (decEndCaseCode >= 11.01 && decEndCaseCode <= 22.24) ||
    (decEndCaseCode >= 33.01 &&
      decEndCaseCode <= 33.04 &&
      decEndCaseCode !== 33.03)
  ) {
    if (endCaseCodeData[decEndCaseCode]) {
      return endCaseCodeData[decEndCaseCode] as documentType['route'];
    }
  }

  return (
    (NACCodeData[
      transformLetterCodeToDec({ code: NACCode })
    ] as documentType['route']) ?? 'exhaustive'
  );
}
