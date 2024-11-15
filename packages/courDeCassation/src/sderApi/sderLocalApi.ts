import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { idModule } from '@label/core';
import { fileSystem, logger } from '@label/backend';
import { sderApiType } from './sderApiType';
import { DecisionDTO } from 'dbsder-api-types';

export { sderLocalApi };

const pathToCourtDecisions = './storage/documents/';

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
      if (response.status != 200 && response.status != 204) {
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
  async fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween({
    startDate,
    endDate,
    source,
    jurisdictions,
    chambers,
  }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      const decisionList = ((await fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&sourceName=${source}&startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${
          endDate.toISOString().split('T')[0]
        }&chamber=${chambers}&jurisdiction=${jurisdictions}`,
        body: {},
      })) as unknown) as {
        _id: string;
        status: string;
        source: string;
        dateCreation: string;
      }[];
      const decisions: DecisionDTO[] = [];
      for (const decisionRef of decisionList) {
        if (decisionRef['status'] == 'toBeTreated') {
          const decision = ((await fetchApi({
            method: 'get',
            path: `decisions/${decisionRef['_id']}`,
            body: {},
          })) as unknown) as DecisionDTO;
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

      return courtDecisions.map(({ content }) => {
        const parsedContent = JSON.parse(content) as DecisionDTO;
        return {
          ...parsedContent,
          _id: idModule.lib.buildId().toString(),
          dateDecision: parsedContent.dateDecision,
        };
      });
    }
  },

  async fetchDecisionsToPseudonymiseBetween({ startDate, endDate, source }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      const decisionList = ((await fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&source=${source}&startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}&dateType=dateDecision`,
        body: {},
      })) as unknown) as {
        _id: string;
        status: string;
        source: string;
        dateCreation: string;
      }[];
      const decisions: DecisionDTO[] = [];
      for (const decisionRef of decisionList) {
        if (decisionRef['status'] == 'toBeTreated') {
          const decision = ((await fetchApi({
            method: 'get',
            path: `decisions/${decisionRef['_id']}`,
            body: {},
          })) as unknown) as DecisionDTO;
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
        const parsedContent = JSON.parse(content) as DecisionDTO;
        return {
          ...parsedContent,
          _id: idModule.lib.buildId().toString(),
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
        }&endDate=${endDate.toISOString().split('T')[0]}&dateType=dateCreation`,
        body: {},
      })) as unknown) as {
        _id: string;
        status: string;
        source: string;
        dateCreation: string;
      }[];
      const decisions: DecisionDTO[] = [];
      for (const decisionRef of decisionList) {
        if (decisionRef['status'] == 'toBeTreated') {
          const decision = ((await fetchApi({
            method: 'get',
            path: `decisions/${decisionRef['_id']}`,
            body: {},
          })) as unknown) as DecisionDTO;
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
        const parsedContent = JSON.parse(content) as DecisionDTO;
        return {
          ...parsedContent,
          _id: idModule.lib.buildId().toString(),
          dateDecision: parsedContent.dateDecision,
        };
      });

      return mappedCourtDecisions.filter(
        (courtDecision) => courtDecision.sourceName === source,
      );
    }
  },

  async fetchChainedJuricaDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
  }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      const decisionList = ((await fetchApi({
        method: 'get',
        path: `decisions?status=toBeTreated&startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}`,
        body: {},
      })) as unknown) as {
        _id: string;
        status: string;
        source: string;
        dateCreation: string;
      }[];
      const decisions: DecisionDTO[] = [];
      for (const decisionRef of decisionList) {
        if (decisionRef['status'] == 'toBeTreated') {
          const decision = await fetchApi({
            method: 'get',
            path: `decisions/${decisionRef['_id']}`,
            body: {},
          });
          if (
            decision['decisionAssociee'] != null &&
            decision['decisionAssociee'] != undefined
          ) {
            decisions.push((decision as unknown) as DecisionDTO);
          }
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

      return courtDecisions.map(({ content }) => {
        const parsedContent = JSON.parse(content) as DecisionDTO;
        return {
          ...parsedContent,
          _id: idModule.lib.buildId().toString(),
          dateDecision: parsedContent.dateDecision,
        };
      });
    }
  },

  async fetchCourtDecisionById({ id }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      return ((await fetchApi({
        method: 'get',
        path: `decisions/${id}`,
        body: {},
      })) as unknown) as Promise<DecisionDTO>;
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
        const parsedContent = JSON.parse(content) as DecisionDTO;
        return {
          ...parsedContent,
          dateDecision: parsedContent.dateDecision,
        };
      });

      return mappedCourtDecisions.find(
        (courtDecision) => courtDecision._id === id,
      ) as DecisionDTO;
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
      const parsedContent = JSON.parse(content) as DecisionDTO;
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
    publishStatus,
  }) {
    //TODO : include publishStatus to dbsder api call
    if (process.env.DBSDER_API_ENABLED === 'true') {
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/rapports-occultations`,
        body: {
          rapportsOccultations: labelTreatments,
          publishStatus: publishStatus,
        },
      });
      await fetchApi({
        method: 'put',
        path: `decisions/${externalId}/decision-pseudonymisee`,
        body: {
          decisionPseudonymisee: pseudonymizationText,
        },
      });
    } else {
      logger.log({
        operationName: 'updateDecisionPseudonymisation',
        msg: 'Warning: API Dbsder is disabled, no export performed',
      });
    }
  },
};
