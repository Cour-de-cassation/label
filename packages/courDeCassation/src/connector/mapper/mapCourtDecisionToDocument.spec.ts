import { labelTreatmentsType } from '@label/backend';
import { idModule } from '@label/core';
import { mapCourtDecisionToDocument } from './mapCourtDecisionToDocument';

describe('mapCourtDecisionToDocument', () => {
  it('should return priority 0 because it has the filler importer', async () => {
    const document = await mapCourtDecisionToDocument(
      {
        _id: idModule.lib.buildId(),
        _rev: 0,
        _version: 0,
        analysis: {
          analyse: [],
          doctrine: '',
          link: '',
          reference: [],
          source: '',
          summary: '',
          target: '',
          title: [],
        },
        appeals: [],
        chamberId: '',
        chamberName: '',
        jurisdictionCode: '',
        jurisdictionId: '',
        jurisdictionName: '',
        labelStatus: 'toBeTreated',
        labelTreatments: ([] as any) as labelTreatmentsType,
        locked: false,
        occultation: {
          additionalTerms: '',
          categoriesToOmit: [],
        },
        originalText: '',
        parties: [],
        public: null,
        pseudoStatus: '',
        pseudoText: '',
        pubCategory: '',
        registerNumber: '',
        solution: '',
        sourceId: 0,
        sourceName: '',
      },
      'filler',
    );

    expect(document.priority).toBe(0);
  });

  it('should return priority 1 because it has the chained importer', async () => {
    const document = await mapCourtDecisionToDocument(
      {
        _id: idModule.lib.buildId(),
        _rev: 0,
        _version: 0,
        analysis: {
          analyse: [],
          doctrine: '',
          link: '',
          reference: [],
          source: '',
          summary: '',
          target: '',
          title: [],
        },
        appeals: [],
        chamberId: '',
        chamberName: '',
        jurisdictionCode: '',
        jurisdictionId: '',
        jurisdictionName: '',
        labelStatus: 'toBeTreated',
        labelTreatments: ([] as any) as labelTreatmentsType,
        locked: false,
        occultation: {
          additionalTerms: '',
          categoriesToOmit: [],
        },
        originalText: '',
        parties: [],
        public: null,
        pseudoStatus: '',
        pseudoText: '',
        pubCategory: '',
        registerNumber: '',
        solution: '',
        sourceId: 0,
        sourceName: '',
      },
      'chained',
    );

    expect(document.priority).toBe(1);
  });
});
