import {
  DecisionTJDTO,
  LabelStatus,
  Occultation,
  PublishStatus,
  Sources,
} from 'dbsder-api-types';
import { ObjectId } from 'mongodb';

export { generateDecision };

const MAX_RAND_NUMBER = 1000000;

function generateDecision(
  decisionFields: Partial<DecisionTJDTO> = {},
): DecisionTJDTO {
  return {
    _id: new ObjectId().toString(),
    codeService: '',
    debatPublic: false,
    decisionAssociee: {
      numeroRegistre: '',
      numeroRoleGeneral: '',
      idJuridiction: '',
      date: '',
    },
    idDecisionTJ: '',
    libelleNAC: '',
    libelleEndCaseCode: '',
    libelleService: '',
    matiereDeterminee: false,
    numeroRoleGeneral: '',
    pourvoiCourDeCassation: false,
    pourvoiLocal: false,
    recommandationOccultation: Occultation.AUCUNE,
    selection: false,
    blocOccultation: 0,
    analysis: {
      doctrine: `DOCTRINE_${Math.random()}`,
      link: `LINK_${Math.random()}`,
      reference: [],
      source: `SOURCE_${Math.random()}`,
      summary: `SUMMARY_${Math.random()}`,
      target: `TARGET_${Math.random()}`,
      title: [],
      analyse: [],
    },
    appeals: [],
    chamberId: `CHAMBER_ID_${Math.random()}`,
    chamberName: `CHAMBER_NAME_${Math.random()}`,
    dateCreation: new Date().toISOString(),
    dateDecision: new Date().toISOString(),
    decatt: undefined,
    jurisdictionCode: `JURISDICTION_CODE_${Math.random()}`,
    jurisdictionId: `JURISDICTION_ID_${Math.random()}`,
    jurisdictionName: `JURISDICTION_NAME_${Math.random()}`,
    labelStatus: LabelStatus.TOBETREATED,
    labelTreatments: [],
    occultation: {
      additionalTerms: '',
      categoriesToOmit: [],
      motivationOccultation: false,
    },
    originalText: `ORIGINAL_TEXT_${Math.random()}`,
    parties: [],
    pseudoStatus: `PSEUDO_STATUS_${Math.random()}`,
    pseudoText: `PSEUDO_TEXT_${Math.random()}`,
    pubCategory: `PUB_CATEGORY_${Math.random()}`,
    public: false,
    registerNumber: `REGISTER_NUMBER_${Math.random()}`,
    solution: `SOLUTION_${Math.random()}`,
    sourceId: Math.floor(Math.random() * MAX_RAND_NUMBER),
    sourceName: Sources.CC,
    zoning: {
      introduction_subzonage: {
        publication: [],
      },
    },
    natureAffaireCivil: `NATURE_AFFAIRE_CIVIL_${Math.random()}`,
    natureAffairePenal: `NATURE_AFFAIRE_PENAL_${Math.random()}`,
    publishStatus: PublishStatus.TOBEPUBLISHED,
    ...decisionFields,
  };
}
