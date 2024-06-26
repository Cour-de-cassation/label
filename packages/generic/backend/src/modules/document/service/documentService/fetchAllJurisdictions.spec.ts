import { documentModule } from '@label/core';
import { buildDocumentRepository } from '../../repository';
import { fetchAllJurisdictions } from './fetchAllJurisdictions';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('fetchAllJurisdictions', () => {
  it('should fetch all the distinc jurisdictions', async () => {
    const documentRepository = buildDocumentRepository();
    const documents = [
      'Cour de cassation',
      "cour d'appel de Dijon",
      '',
      "cour d'appel de Bordeaux",
    ].map((jurisdiction) =>
      documentModule.generator.generate({
        decisionMetadata: documentModule.decisionMetadataGenerator.generate({
          appealNumber: '',
          additionalTermsToAnnotate: '',
          boundDecisionDocumentNumbers: [],
          categoriesToOmit: [],
          chamberName: '',
          criminalCaseCode: '',
          civilCaseCode: '',
          civilMatterCode: '',
          date: new Date().getTime(),
          occultationBlock: undefined,
          parties: [],
          session: '',
          solution: '',
          jurisdiction,
          NACCode: '',
          endCaseCode: '',
        }),
      }),
    );
    await documentRepository.insertMany(documents);

    const jurisdictions = await fetchAllJurisdictions();

    expect(jurisdictions.sort()).toEqual(
      [
        'Cour de cassation',
        "cour d'appel de Dijon",
        "cour d'appel de Bordeaux",
      ].sort(),
    );
  });
});
