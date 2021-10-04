import { decisionModule, decisionType } from 'sder';
import { documentModule, documentType, idModule } from '@label/core';

export { buildFakeConnectorWithNDecisions };

type partialDecisionType = Partial<
  Pick<decisionType, 'labelStatus' | 'sourceName' | 'dateCreation' | 'sourceId'>
>;

async function buildFakeConnectorWithNDecisions(
  courtDecisionFields: partialDecisionType[],
) {
  let courtDecisions = courtDecisionFields.map(
    ({ sourceName, labelStatus, dateCreation, sourceId }) =>
      decisionModule.lib.generateDecision({
        sourceName,
        labelStatus,
        dateCreation,
        sourceId,
      }),
  );

  return {
    name: 'FAKE_CONNECTOR',
    async fetchAllCourtDecisions() {
      return courtDecisions;
    },
    async fetchPublicDecisionsBySourceAndJurisdictionsBetween({
      startDate,
      endDate = new Date(),
      source,
      jurisdictions,
    }: {
      startDate: Date;
      endDate?: Date;
      source: string;
      jurisdictions: string[];
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
    async fetchAllCourtDecisionsBetween({
      startDate,
      endDate,
    }: {
      startDate: Date;
      endDate: Date;
    }) {
      return courtDecisions.filter((courtDecision) => {
        if (!courtDecision.dateCreation) {
          return false;
        }
        const dateCreation = new Date(courtDecision.dateCreation);

        return (
          dateCreation.getTime() >= startDate.getTime() &&
          dateCreation.getTime() <= endDate.getTime()
        );
      });
    },
    async updateDocumentsLoadedStatus(documents: documentType[]) {
      courtDecisions = courtDecisions.map((courtDecision) => {
        if (
          documents.some((document) =>
            idModule.lib.equalId(
              idModule.lib.buildId(document.externalId),
              courtDecision._id,
            ),
          )
        ) {
          return { ...courtDecision, labelStatus: 'loaded' };
        }
        return courtDecision;
      });
    },
    async updateDocumentsToBeTreatedStatus(documents: documentType[]) {
      courtDecisions = courtDecisions.map((courtDecision) => {
        if (
          documents.some((document) =>
            idModule.lib.equalId(
              idModule.lib.buildId(document.externalId),
              courtDecision._id,
            ),
          )
        ) {
          return { ...courtDecision, labelStatus: 'toBeTreated' };
        }
        return courtDecision;
      });
    },
    mapCourtDecisionToDocument: fakeSderMapper.mapCourtDecisionToDocument,
  };
}

const fakeSderMapper = {
  mapCourtDecisionToDocument(courtDecision: decisionType) {
    return documentModule.generator.generate({
      status: 'loaded',
      externalId: idModule.lib.convertToString(courtDecision._id),
      documentNumber: courtDecision.sourceId,
      source: courtDecision.sourceName,
    });
  },
};
