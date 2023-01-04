import { decisionModule } from 'sder';
import { documentType, idModule } from '@label/core';
import { sderApiType } from './sderApiType';

export { sderApi };

const sderApi: sderApiType = {
  async fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween({
    startDate,
    endDate,
    source,
    jurisdictions,
    chambers,
  }) {
    const courtDecisions = await decisionModule.service.fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween(
      { startDate, endDate, jurisdictions, chambers, source },
    );

    return courtDecisions;
  },

  async fetchPublicDecisionsBySourceAndJurisdictionsAndChambersBetween({
    startDate,
    endDate,
    source,
    jurisdictions,
    chambers,
  }) {
    const courtDecisions = await decisionModule.service.fetchPublicDecisionsBySourceAndJurisdictionsAndChambersBetween(
      { startDate, endDate, jurisdictions, chambers, source },
    );

    return courtDecisions;
  },

  async fetchDecisionsToPseudonymiseBetween({ startDate, endDate, source }) {
    const courtDecisions = await decisionModule.service.fetchDecisionsToPseudonymiseBetween(
      {
        startDate,
        endDate,
        source,
      },
    );

    return courtDecisions;
  },

  async fetchDecisionsToPseudonymiseBetweenDateCreation({
    startDate,
    endDate,
    source,
  }) {
    const courtDecisions = await decisionModule.service.fetchDecisionsToPseudonymiseBetweenDateCreation(
      {
        startDate,
        endDate,
        source,
      },
    );

    return courtDecisions;
  },

  async fetchChainedJuricaDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
  }) {
    const courtDecisions = await decisionModule.service.fetchChainedJuricaDecisionsToPseudonymiseBetween(
      { startDate, endDate },
    );

    return courtDecisions;
  },

  async fetchCourtDecisionBySourceIdAndSourceName(sourceId, sourceName) {
    return decisionModule.service.fetchDecisionBySourceIdAndSourceName(
      sourceId,
      sourceName,
    );
  },

  async setCourtDecisionsLoaded(documents: documentType[]) {
    await decisionModule.service.updateDecisionsLabelStatus({
      decisionIds: documents.map((document) =>
        idModule.lib.buildId(document.externalId),
      ),
      labelStatus: 'loaded',
    });
  },

  async setCourtDecisionsToBeTreated(documents: documentType[]) {
    await decisionModule.service.updateDecisionsLabelStatus({
      decisionIds: documents.map((document) =>
        idModule.lib.buildId(document.externalId),
      ),
      labelStatus: 'toBeTreated',
    });
  },

  async setCourtDecisionDone(externalId) {
    await decisionModule.service.updateDecisionsLabelStatus({
      decisionIds: [idModule.lib.buildId(externalId)],
      labelStatus: 'done',
    });
  },

  async setCourtDecisionLocked(externalId) {
    await decisionModule.service.updateDecisionsLabelStatus({
      decisionIds: [idModule.lib.buildId(externalId)],
      labelStatus: 'locked',
    });
  },

  async updateDecisionPseudonymisation({
    externalId,
    pseudonymizationText,
    labelTreatments,
  }) {
    await decisionModule.service.updateDecisionPseudonymisation({
      decisionId: idModule.lib.buildId(externalId),
      decisionPseudonymisedText: pseudonymizationText,
      labelTreatments,
    });
  },
};
