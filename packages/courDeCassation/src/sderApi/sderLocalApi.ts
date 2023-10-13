import axios, { Method } from 'axios';
import { decisionType } from 'sder';
import { environmentType, idModule } from '@label/core';
import { fileSystem, logger } from '@label/backend';
import { sderApiType } from './sderApiType';

export { sderLocalApi };

const pathToCourtDecisions = './storage/documents/';

async function fetchApi({
  method,
  path,
  body,
  environment,
}: {
  method: Method;
  path: string;
  body: Record<string, unknown>;
  environment: environmentType;
}) {
  await axios({
    method: method,
    baseURL: `${environment.pathName.db_api}:${environment.port.db_api}/${environment.version.db_api}`,
    url: `/${path}`,
    data: body,
    headers: {
      'x-api-key': environment.api_key.db_api ?? '',
    },
  }).catch(({ response }) => {
    throw new Error(response);
  });
}

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

  async fetchDecisionsToPseudonymiseBetween({ startDate, endDate, source, environment }) {
    if (environment.db_api_enabled) {
      return (fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&source=${source}&startDate=${startDate}&endDate=${endDate}`,
        body: {},
        environment,
      }) as unknown) as Promise<decisionType[]>;
    } else {
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
    }
  },

  async fetchDecisionsToPseudonymiseBetweenDateCreation({
    startDate, endDate,
    source,
    environment,
  }) {
    if (environment.db_api_enabled) {
      return (fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&source=${source}&startDate=${startDate}&endDate=${endDate}`,
        body: {},
        environment,
      }) as unknown) as Promise<decisionType[]>;
    } else {
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
    }
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

  async fetchCourtDecisionById({ id, environment }) {
    if (environment.db_api_enabled) {
      return (fetchApi({
        method: 'get',
        path: `decisions/${id}/`,
        body: {},
        environment,
      }) as unknown) as Promise<decisionType>;
    } else {
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
    }
  },

  async fetchCourtDecisionBySourceIdAndSourceName({ sourceId, sourceName }) {
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

  async setCourtDecisionsLoaded({ documents, environment }) {
    if (environment.db_api_enabled) {
      documents.forEach((document) => {
        fetchApi({
          method: 'put',
          path: `decisions/${document.externalId}/`,
          body: { statut: 'loaded' },
          environment,
        });
      });
    }
  },

  async setCourtDecisionsToBeTreated({ documents, environment }) {
    if (environment.db_api_enabled) {
      documents.forEach((document) => {
        fetchApi({
          method: 'put',
          path: `decisions/${document.externalId}/`,
          body: { statut: 'toBeTreated' },
          environment,
        });
      });
    }
  },

  async setCourtDecisionDone({ externalId, environment }) {
    if (environment.db_api_enabled) {
      fetchApi({
        method: 'put',
        path: `decisions/${externalId}/`,
        body: { statut: 'done' },
        environment,
      });
    }
  },

  async setCourtDecisionBlocked({ externalId, environment }) {
    if (environment.db_api_enabled) {
      fetchApi({
        method: 'put',
        path: `decisions/${externalId}/`,
        body: { statut: 'blocked' },
        environment,
      });
    }
  },

  async updateDecisionPseudonymisation({
    externalId,
    labelTreatments,
    pseudonymizationText,
    environment,
  }) {
    if (environment.db_api_enabled) {
      fetchApi({
        method: 'put',
        path: `decisions/${externalId}/rapports-occultations`,
        body: { rapportsOccultations: labelTreatments },
        environment,
      });
      fetchApi({
        method: 'put',
        path: `decisions/${externalId}/decision-pseudonymisee`,
        body: { decisionPseudonymisee: pseudonymizationText },
        environment,
      });
    } else {
      logger.log('Warning: API Dbsder is disabled, no export performed');
    }
  },
};
