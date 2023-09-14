import { decisionType } from 'sder';
import { idModule } from '@label/core';
import { fileSystem } from '@label/backend';
import { sderApiType } from './sderApiType';
import axios from 'axios';
import { logger } from '@label/backend';
import * as dotenv from 'dotenv';

dotenv.config();

export { sderLocalApi };

const pathToCourtDecisions = './storage/documents/';

const sderLocalApi: sderApiType = {
  async fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween() {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    return courtDecisions.map(({ content }) => {
      const parsedContent = JSON.parse(content) as decisionType;
      return {
        ...parsedContent,
        _id: idModule.lib.buildId(),
        dateDecision: parsedContent.dateDecision,
      };
    });
  },

  async fetchPublicDecisionsBySourceAndJurisdictionsAndChambersBetween() {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    return courtDecisions.map(({ content }) => {
      const parsedContent = JSON.parse(content) as decisionType;
      return {
        ...parsedContent,
        _id: idModule.lib.buildId(),
        dateDecision: parsedContent.dateDecision,
      };
    });
  },

  async fetchDecisionsToPseudonymiseBetween() {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    return courtDecisions.map(({ content }) => {
      const parsedContent = JSON.parse(content) as decisionType;
      return {
        ...parsedContent,
        _id: idModule.lib.buildId(),
        dateDecision: parsedContent.dateDecision,
      };
    });
  },

  async fetchDecisionsToPseudonymiseBetweenDateCreation({ source }) {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    const mappedCourtDecisions = courtDecisions.map(({ content }) => {
      const parsedContent = JSON.parse(content) as decisionType;
      return {
        ...parsedContent,
        _id: idModule.lib.buildId(),
        dateDecision: parsedContent.dateDecision,
      };
    });

    return mappedCourtDecisions.filter(
      (courtDecision) => courtDecision.sourceName === source,
    );
  },

  async fetchChainedJuricaDecisionsToPseudonymiseBetween() {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    return courtDecisions.map(({ content }) => {
      const parsedContent = JSON.parse(content) as decisionType;
      return {
        ...parsedContent,
        _id: idModule.lib.buildId(),
        dateDecision: parsedContent.dateDecision,
      };
    });
  },

  async fetchCourtDecisionById(id) {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    const mappedCourtDecisions = courtDecisions.map(({ content }) => {
      const parsedContent = JSON.parse(content) as decisionType;
      return {
        ...parsedContent,
        dateDecision: parsedContent.dateDecision,
      };
    });

    return mappedCourtDecisions.find((courtDecision) =>
      courtDecision._id.equals(id),
    ) as decisionType;
  },

  async fetchCourtDecisionBySourceIdAndSourceName(sourceId, sourceName) {
    const courtDecisionFileNames = await fileSystem.listFilesOfDirectory(
      pathToCourtDecisions,
    );

    const courtDecisions = await fileSystem.readFiles(
      courtDecisionFileNames,
      'utf8',
      pathToCourtDecisions,
    );

    const mappedCourtDecisions = courtDecisions.map(({ content }) => {
      const parsedContent = JSON.parse(content) as decisionType;
      return {
        ...parsedContent,
        dateDecision: parsedContent.dateDecision,
      };
    });

    return mappedCourtDecisions.find(
      (courtDecision) =>
        courtDecision.sourceId === sourceId &&
        courtDecision.sourceName === sourceName,
    );
  },

  async setCourtDecisionsLoaded() {},

  async setCourtDecisionsToBeTreated() {},

  async setCourtDecisionDone() {},

  async setCourtDecisionBlocked() {},

  async updateDecisionPseudonymisation({
    externalId,
    labelTreatments,
    decisionPseudonymisedText,
  }) {
    // await decisionModule.service.updateDecisionPseudonymisation({
    //   decisionId: idModule.lib.buildId(externalId),
    //   decisionPseudonymisedText: pseudonymizationText,
    //   labelTreatments,
    // });
    logger.log('updateDecisionPseudonymisation LOCAL');
    await axios.put(
      `http://${process.env.DBSDER_API_HOSTNAME}:${process.env.DBSDER_API_PORT}/${process.env.DBSDER_API_VERSION}/decisions/${externalId}/rapports-occultations`,
      { labelTreatments },
      {
        headers: {
          'x-api-key': process.env.LABEL_API_KEY,
        },
      },
    );
    await axios.put(
      `http://${process.env.DBSDER_API_HOSTNAME}:${process.env.DBSDER_API_PORT}/${process.env.DBSDER_API_VERSION}/decisions/${externalId}/decision-pseudonymisee`,
      { decisionPseudonymisedText },
      {
        headers: {
          'x-api-key': process.env.LABEL_API_KEY,
        },
      },
    );
  },
};
