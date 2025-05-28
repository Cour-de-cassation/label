import { idModule } from '@label/core';
import { mapCourtDecisionToDocument } from './mapCourtDecisionToDocument';
import { Deprecated } from '@label/core';

describe('mapCourtDecisionToDocument', () => {
  it('should return priority 0 because it has the filler importer', async () => {
    const document = await mapCourtDecisionToDocument(
      {
        _id: idModule.lib.buildId().toString(),
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
        labelStatus: Deprecated.LabelStatus.TOBETREATED,
        labelTreatments: [],
        blocOccultation: 0,
        dateCreation: '',
        dateDecision: '',
        occultation: {
          additionalTerms: '',
          categoriesToOmit: [],
          motivationOccultation: false,
        },
        originalText: '',
        parties: [],
        public: undefined,
        pseudoText: '',
        pubCategory: '',
        registerNumber: '',
        solution: '',
        sourceId: 0,
        sourceName: Deprecated.Sources.CA,
        selection: false,
      },
      'filler',
    );

    expect(document.priority).toBe(0);
  });

  it('should return priority 1 because it has the chained importer', async () => {
    const document = await mapCourtDecisionToDocument(
      {
        _id: idModule.lib.buildId().toString(),
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
        labelStatus: Deprecated.LabelStatus.TOBETREATED,
        labelTreatments: [],
        blocOccultation: 0,
        dateCreation: '',
        dateDecision: '',
        occultation: {
          additionalTerms: '',
          categoriesToOmit: [],
          motivationOccultation: false,
        },
        originalText: '',
        parties: [],
        public: undefined,
        pseudoText: '',
        pubCategory: '',
        registerNumber: '',
        solution: '',
        sourceId: 0,
        sourceName: Deprecated.Sources.CA,
        selection: false,
      },
      'chained',
    );

    expect(document.priority).toBe(1);
  });

  it('should return priority 1 because it CA document', async () => {
    const document = await mapCourtDecisionToDocument(
      {
        _id: idModule.lib.buildId().toString(),
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
        labelStatus: Deprecated.LabelStatus.TOBETREATED,
        labelTreatments: [],
        blocOccultation: 0,
        dateCreation: '',
        dateDecision: '',
        occultation: {
          additionalTerms: '',
          categoriesToOmit: [],
          motivationOccultation: false,
        },
        originalText: '',
        parties: [],
        public: undefined,
        pseudoText: '',
        pubCategory: '',
        registerNumber: '',
        solution: '',
        sourceId: 0,
        sourceName: Deprecated.Sources.CA,
        selection: false,
      },
      'recent',
    );

    expect(document.priority).toBe(1);
  });
});
