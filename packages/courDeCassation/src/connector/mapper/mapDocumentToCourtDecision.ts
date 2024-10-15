import {documentType, idModule} from '@label/core';
import {DecisionTJDTO, LabelStatus, Occultation, Sources} from "dbsder-api-types";

export {mapDocumentToCourtDecision};

function mapDocumentToCourtDecision(document: documentType): DecisionTJDTO {
    let dateDecision;
    if (document.decisionMetadata.date) {
        dateDecision = new Date();
        dateDecision.setTime(document.decisionMetadata.date);
    }
    let dateCreation;
    if (document.creationDate) {
        dateCreation = new Date();
        dateCreation.setTime(document.creationDate);
    }

    return {
        codeService: "",
        debatPublic: false,
        decisionAssociee: {
            numeroRegistre: '',
            numeroRoleGeneral: '',
            idJuridiction: '',
            date: ''
        },
        idDecisionTJ: "",
        libelleEndCaseCode: "",
        libelleNAC: "",
        libelleService: "",
        matiereDeterminee: false,
        numeroRoleGeneral: "",
        pourvoiCourDeCassation: false,
        pourvoiLocal: false,
        recommandationOccultation: Occultation.AUCUNE,
        selection: false,
        _id: idModule.lib.buildId(document.externalId).toString(),
        blocOccultation: document.decisionMetadata.occultationBlock ?? 0,
        chamberName: document.decisionMetadata.chamberName,
        dateCreation: dateCreation?.toISOString() ?? (new Date()).toISOString(),
        dateDecision: dateDecision?.toISOString() ?? (new Date()).toISOString(),
        decatt: document.decisionMetadata.boundDecisionDocumentNumbers,
        formation: document.decisionMetadata.session,
        jurisdictionName: document.decisionMetadata.jurisdiction,
        labelStatus: LabelStatus.TOBETREATED,
        natureAffaireCivil: document.decisionMetadata.civilCaseCode,
        natureAffairePenal: document.decisionMetadata.criminalCaseCode,
        codeMatiereCivil: document.decisionMetadata.civilMatterCode,
        originalText: document.text,
        labelTreatments: [],
        occultation: {
            additionalTerms: document.decisionMetadata.additionalTermsToAnnotate,
            categoriesToOmit: document.decisionMetadata.categoriesToOmit,
            motivationOccultation: true
        },
        publication: document.publicationCategory.filter(
            (publicationCategoryLetter) =>
                ['B', 'R', 'L', 'C'].includes(publicationCategoryLetter),
        ),
        pubCategory: document.publicationCategory.find(
            (publicationCategoryLetter) =>
                !['B', 'R', 'L', 'C'].includes(publicationCategoryLetter),
        ),
        sourceId: document.documentNumber,
        sourceName: document.source as Sources,
        solution: document.decisionMetadata.solution,
        appeals: [],
        chamberId: document.decisionMetadata.chamberName,
        jurisdictionCode: document.decisionMetadata.jurisdiction,
        jurisdictionId: document.decisionMetadata.jurisdiction,
        registerNumber: ''
    };
}
