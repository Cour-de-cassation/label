import {documentType, idModule} from '@label/core';
import {DecisionDTO, LabelStatus} from "dbsder-api-types";

export {mapDocumentToCourtDecision};

function mapDocumentToCourtDecision(document: documentType): DecisionDTO {
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
        _id: idModule.lib.buildId(document.externalId),
        blocOccultation: document.decisionMetadata.occultationBlock,
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
        sourceName: document.source,
        solution: document.decisionMetadata.solution,
        appeals: document.decisionMetada.appeals,
        chamberId: document.decisionMetada.chamberId,
        jurisdictionCode: document.decisionMetada.jurisdictionCode,
        jurisdictionId: document.decisionMetada.jurisdictionId,
        registerNumber: document.decisionMetada.registerNumber
    };
}
