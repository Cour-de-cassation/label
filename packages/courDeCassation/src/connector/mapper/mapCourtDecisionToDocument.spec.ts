import { idModule } from '@label/core';
import { mapCourtDecisionToDocument } from './mapCourtDecisionToDocument';
import { LabelStatus, Occultation, Sources } from 'dbsder-api-types';

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
        labelStatus: LabelStatus.TOBETREATED,
        labelTreatments: [],
        blocOccultation: 0,
        codeService: '',
        dateCreation: '',
        dateDecision: '',
        debatPublic: false,
        decisionAssociee: {
          numeroRegistre: '',
          numeroRoleGeneral: '',
          idJuridiction: '',
          date: '',
        },
        idDecisionTJ: '',
        libelleEndCaseCode: '',
        libelleNAC: '',
        libelleService: '',
        matiereDeterminee: false,
        numeroRoleGeneral: '',
        pourvoiCourDeCassation: false,
        pourvoiLocal: false,
        recommandationOccultation: Occultation.CONFORME,
        selection: false,
        occultation: {
          additionalTerms: '',
          categoriesToOmit: [],
          motivationOccultation: false,
        },
        originalText: '',
        parties: [],
        public: undefined,
        pseudoStatus: '',
        pseudoText: '',
        pubCategory: '',
        registerNumber: '',
        solution: '',
        sourceId: 0,
        sourceName: Sources.CA,
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
        labelStatus: LabelStatus.TOBETREATED,
        labelTreatments: [],
        blocOccultation: 0,
        codeService: '',
        dateCreation: '',
        dateDecision: '',
        debatPublic: false,
        decisionAssociee: {
          numeroRegistre: '',
          numeroRoleGeneral: '',
          idJuridiction: '',
          date: '',
        },
        idDecisionTJ: '',
        libelleEndCaseCode: '',
        libelleNAC: '',
        libelleService: '',
        matiereDeterminee: false,
        numeroRoleGeneral: '',
        pourvoiCourDeCassation: false,
        pourvoiLocal: false,
        recommandationOccultation: Occultation.AUCUNE,
        selection: false,
        occultation: {
          additionalTerms: '',
          categoriesToOmit: [],
          motivationOccultation: false,
        },
        originalText: '',
        parties: [],
        public: undefined,
        pseudoStatus: '',
        pseudoText: '',
        pubCategory: '',
        registerNumber: '',
        solution: '',
        sourceId: 0,
        sourceName: Sources.CA,
      },
      'chained',
    );

    expect(document.priority).toBe(1);
  });
});
