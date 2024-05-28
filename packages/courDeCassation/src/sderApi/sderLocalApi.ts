import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { decisionType } from 'sder';
import { idModule } from '@label/core';
import { fileSystem, logger } from '@label/backend';
import { sderApiType } from './sderApiType';

export { sderLocalApi };

const pathToCourtDecisions = 'packages/courDeCassation/storage/documents/';

async function fetchApi({
  method,
  path,
  body,
}: {
  method: Method;
  path: string;
  body: Record<string, unknown>;
}) {
  return await axios({
    method: method,
    baseURL: `${process.env.DBSDER_API_URL}/${process.env.DBSDER_API_VERSION}`,
    url: `/${path}`,
    data: body,
    headers: {
      'x-api-key': process.env.DBSDER_API_KEY ?? '',
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

  async fetchDecisionsToPseudonymiseBetween({ startDate, endDate, source }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      const decisionList = ((await fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&source=${source}&startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}`,
        body: {},
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
  }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      const decisionList = ((await fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&source=${source}&startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}`,
        body: {},
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

  async fetchCourtDecisionById({ id }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      return ((await fetchApi({
        method: 'get',
        path: `decisions/${id}`,
        body: {},
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

  async setCourtDecisionsLoaded({ documents }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      documents.forEach(async (document) => {
        return await fetchApi({
          method: 'put',
          path: `decisions/${document.externalId}/`,
          body: { statut: 'loaded' },
        });
      });
    } else {
      logger.log({
        operationName: 'setCourtDecisionsLoaded',
        msg: 'Warning: API Dbsder is disabled, no action performed',
      });
    }
  },

  async setCourtDecisionsToBeTreated({ documents }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      documents.forEach(async (document) => {
        return await fetchApi({
          method: 'put',
          path: `decisions/${document.externalId}/`,
          body: { statut: 'toBeTreated' },
        });
      });
    } else {
      logger.log({
        operationName: 'setCourtDecisionsToBeTreated',
        msg: 'Warning: API Dbsder is disabled, no action performed',
      });
    }
  },

  async setCourtDecisionDone({ externalId }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/`,
        body: { statut: 'done' },
      });
    } else {
      logger.log({
        operationName: 'setCourtDecisionDone',
        msg: 'Warning: API Dbsder is disabled, no action performed',
      });
    }
  },

  async setCourtDecisionBlocked({ externalId }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/`,
        body: { statut: 'blocked' },
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
  }) {
    //TODO : include publishStatus to dbsder api call
    if (process.env.DBSDER_API_ENABLED === 'true') {
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/rapports-occultations`,
        body: { rapportsOccultations: labelTreatments },
      });
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/decision-pseudonymisee`,
        body: { decisionPseudonymisee: pseudonymizationText },
      });
    } else {
      logger.log({
        operationName: 'updateDecisionPseudonymisation',
        msg: 'Warning: API Dbsder is disabled, no export performed',
      });
    }
  },
};
