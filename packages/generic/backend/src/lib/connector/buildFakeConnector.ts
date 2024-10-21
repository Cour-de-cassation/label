import { documentModule, documentType, idModule } from '@label/core';
import { DecisionTJDTO, LabelStatus, Sources } from 'dbsder-api-types';
import { generateDecision } from './generateDecision';

export { buildFakeConnectorWithNDecisions };

type partialDecisionType = Partial<
  Pick<
    DecisionTJDTO,
    'labelStatus' | 'sourceName' | 'dateDecision' | 'dateCreation' | 'sourceId'
  >
>;

/* eslint-disable @typescript-eslint/no-unused-vars */
async function buildFakeConnectorWithNDecisions(
  courtDecisionFields: partialDecisionType[],
) {
  let courtDecisions = courtDecisionFields.map(
    ({ sourceName, labelStatus, dateDecision, dateCreation, sourceId }) =>
      generateDecision({
        sourceName,
        labelStatus,
        dateDecision,
        dateCreation,
        sourceId,
      }),
  );

  return {
    name: 'FAKE_CONNECTOR',
    fetchAllCourtDecisions() {
      return courtDecisions;
    },
    async fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween({
      startDate,
      endDate = new Date(),
      source,
      jurisdictions,
      chambers,
    }: {
      startDate: Date;
      endDate?: Date;
      source: string;
      jurisdictions: string[];
      chambers: string[];
    }) {
      return courtDecisions.filter((courtDecision) => {
        if (!courtDecision.dateDecision) {
          return false;
        }
        const dateDecision = new Date(courtDecision.dateDecision);

        return (
          dateDecision.getTime() >= startDate.getTime() &&
          dateDecision.getTime() <= endDate.getTime() &&
          jurisdictions.includes(courtDecision.jurisdictionName) &&
          chambers.includes(courtDecision.chamberId) &&
          courtDecision.sourceName === source
        );
      });
    },
    async fetchCourtDecisionBySourceIdAndSourceName({
      sourceId,
      sourceName,
    }: {
      sourceId: number;
      sourceName: string;
    }) {
      return courtDecisions.find(
        (courtDecision) =>
          courtDecision.sourceId === sourceId &&
          courtDecision.sourceName === sourceName,
      );
    },
    async fetchChainedJuricaDecisionsToPseudonymiseBetween({
      startDate,
      endDate,
    }: {
      startDate: Date;
      endDate: Date;
    }) {
      return courtDecisions.filter((courtDecision) => {
        if (!courtDecision.dateDecision) {
          return false;
        }
        const dateDecision = new Date(courtDecision.dateDecision);

        return (
          courtDecision.sourceName === Sources.CA &&
          dateDecision.getTime() >= startDate.getTime() &&
          dateDecision.getTime() <= endDate.getTime()
        );
      });
    },
    async fetchDecisionsToPseudonymiseBetween({
      startDate,
      endDate,
      source,
    }: {
      startDate: Date;
      endDate: Date;
      source: Sources;
    }) {
      return courtDecisions.filter((courtDecision) => {
        if (!courtDecision.dateDecision) {
          return false;
        }
        const dateDecision = new Date(courtDecision.dateDecision);

        return (
          courtDecision.sourceName === source &&
          dateDecision.getTime() >= startDate.getTime() &&
          dateDecision.getTime() <= endDate.getTime()
        );
      });
    },
    async fetchDecisionsToPseudonymiseBetweenDateCreation({
      startDate,
      endDate,
      source,
    }: {
      startDate: Date;
      endDate: Date;
      source: Sources;
    }) {
      return courtDecisions.filter((courtDecision) => {
        if (!courtDecision.dateCreation) {
          return false;
        }
        const dateCreation = new Date(courtDecision.dateCreation);

        return (
          courtDecision.sourceName === source &&
          dateCreation.getTime() >= startDate.getTime() &&
          dateCreation.getTime() <= endDate.getTime()
        );
      });
    },
    async updateDocumentsLoadedStatus({
      documents,
    }: {
      documents: documentType[];
    }) {
      courtDecisions = courtDecisions.map((courtDecision) => {
        if (
          documents.some((document) =>
            idModule.lib.equalId(
              idModule.lib.buildId(document.externalId),
              idModule.lib.buildId(courtDecision._id),
            ),
          )
        ) {
          return { ...courtDecision, labelStatus: LabelStatus.LOADED };
        }
        return courtDecision;
      });
    },
    async updateDocumentsToBeTreatedStatus({
      documents,
    }: {
      documents: documentType[];
    }) {
      courtDecisions = courtDecisions.map((courtDecision) => {
        if (
          documents.some((document) =>
            idModule.lib.equalId(
              idModule.lib.buildId(document.externalId),
              idModule.lib.buildId(courtDecision._id),
            ),
          )
        ) {
          return { ...courtDecision, labelStatus: LabelStatus.TOBETREATED };
        }
        return courtDecision;
      });
    },
    mapCourtDecisionToDocument: fakeSderMapper.mapCourtDecisionToDocument,
    mapDocumentToCourtDecision: fakeSderMapper.mapDocumentToCourtDecision,
  };
}

const fakeSderMapper = {
  mapDocumentToCourtDecision(document: documentType): DecisionTJDTO {
    return (({
      labelStatus: LabelStatus.LOADED,
      _id: idModule.lib.convertToString(document.externalId),
      sourceId: document.documentNumber,
      sourceName: document.source as Sources,
      decatt: document.decisionMetadata.boundDecisionDocumentNumbers,
    } as unknown) as any) as DecisionTJDTO;
  },
  mapCourtDecisionToDocument(courtDecision: DecisionTJDTO) {
    return new Promise(function executor(resolve) {
      resolve(
        documentModule.generator.generate({
          status: LabelStatus.LOADED,
          externalId: idModule.lib.convertToString(courtDecision._id ?? ''),
          documentNumber: courtDecision.sourceId,
          source: courtDecision.sourceName,
        }),
      );
    }) as Promise<documentType>;
  },
};
