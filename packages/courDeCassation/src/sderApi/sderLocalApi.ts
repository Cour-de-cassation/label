import axios, { AxiosError, AxiosResponse, Method } from 'axios';
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
  return await axios({
    method: method,
    baseURL: `${environment.pathName.db_api}:${environment.port.db_api}/${environment.version.db_api}`,
    url: `/${path}`,
    data: body,
    headers: {
      'x-api-key': environment.api_key.db_api ?? '',
    },
  })
    .then((response: AxiosResponse) => {
      if (response.status != 200) {
        throw new Error(`${response.status} ${response.statusText}`);
      } else {
        return response.data as Record<string, unknown>;
      }
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        throw new Error(
          `${error.response.status} ${error.response.statusText}`,
        );
      }
      throw new Error(`${error.code ?? 'Unknown'} on /${path}`);
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

  async fetchDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
    source,
    environment,
  }) {
    if (environment.db_api_enabled) {
      const decisionList = ((await fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&source=${source}&startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}`,
        body: {},
        environment,
      })) as unknown) as {
        _id: string;
        status: string;
        source: string;
        dateCreation: string;
      }[];
      const decisions: decisionType[] = [];
      for (const decisionRef of decisionList) {
        if (decisionRef['status'] == 'toBeTreated') {
          const decision = (await fetchApi({
            method: 'get',
            path: `decisions/${decisionRef['_id']}`,
            body: {},
            environment,
          })) as decisionType;
          decisions.push(decision);
        }
      }
      return decisions;
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

  async fetchDecisionsToPseudonymiseBetweenDateCreation({
    startDate,
    endDate,
    source,
    environment,
  }) {
    if (environment.db_api_enabled) {
      const decisionList = ((await fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&source=${source}&startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}`,
        body: {},
        environment,
      })) as unknown) as {
        _id: string;
        status: string;
        source: string;
        dateCreation: string;
      }[];
      const decisions: decisionType[] = [];
      for (const decisionRef of decisionList) {
        if (decisionRef['status'] == 'toBeTreated') {
          const decision = (await fetchApi({
            method: 'get',
            path: `decisions/${decisionRef['_id']}`,
            body: {},
            environment,
          })) as decisionType;
          decisions.push(decision);
        }
      }
      return decisions;
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
      return ((await fetchApi({
        method: 'get',
        path: `decisions/${id}`,
        body: {},
        environment,
      })) as unknown) as Promise<decisionType>;
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
      documents.forEach(async (document) => {
        return await fetchApi({
          method: 'put',
          path: `decisions/${document.externalId}/`,
          body: { statut: 'loaded' },
          environment,
        });
      });
    } else {
      logger.log({
        operationName: 'setCourtDecisionsLoaded',
        msg: 'Warning: API Dbsder is disabled, no action performed',
      });
    }
  },

  async setCourtDecisionsToBeTreated({ documents, environment }) {
    if (environment.db_api_enabled) {
      documents.forEach(async (document) => {
        return await fetchApi({
          method: 'put',
          path: `decisions/${document.externalId}/`,
          body: { statut: 'toBeTreated' },
          environment,
        });
      });
    } else {
      logger.log({
        operationName: 'setCourtDecisionsToBeTreated',
        msg: 'Warning: API Dbsder is disabled, no action performed',
      });
    }
  },

  async setCourtDecisionDone({ externalId, environment }) {
    if (environment.db_api_enabled) {
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/`,
        body: { statut: 'done' },
        environment,
      });
    } else {
      logger.log({
        operationName: 'setCourtDecisionDone',
        msg: 'Warning: API Dbsder is disabled, no action performed',
      });
    }
  },

  async setCourtDecisionBlocked({ externalId, environment }) {
    if (environment.db_api_enabled) {
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/`,
        body: { statut: 'blocked' },
        environment,
      });
    } else {
      logger.log({
        operationName: 'setCourtDecisionBlocked',
        msg: 'Warning: API Dbsder is disabled, no action performed',
      });
    }
  },

  async updateDecisionPseudonymisation({
    externalId,
    labelTreatments,
    pseudonymizationText,
    environment,
  }) {
    //TODO : include publishStatus to dbsder api call
    if (environment.db_api_enabled) {
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/rapports-occultations`,
        body: { rapportsOccultations: labelTreatments },
        environment,
      });
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/decision-pseudonymisee`,
        body: { decisionPseudonymisee: pseudonymizationText },
        environment,
      });
    } else {
      logger.log({
        operationName: 'updateDecisionPseudonymisation',
        msg: 'Warning: API Dbsder is disabled, no export performed',
      });
    }
  },
};
