import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { decisionModule, decisionType } from 'sder';
import { idModule } from '@label/core';
import { sderApiType } from './sderApiType';
import { logger } from '@label/backend';

export { sderApi };

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

const sderApi: sderApiType = {
  async fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween({
    startDate,
    endDate,
    source,
    jurisdictions,
    chambers,
  }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      logger.log({
        operationName:
          'fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween',
        msg:
          'Warning: The method fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween is not implemented for the db_api, switching to Mongo request',
      });
    }
    return await decisionModule.service.fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween(
      { startDate, endDate, jurisdictions, chambers, source },
    );
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
      return await decisionModule.service.fetchDecisionsToPseudonymiseBetween({
        startDate,
        endDate,
        source,
      });
    }
  },

  async fetchDecisionsToPseudonymiseBetweenDateCreation({
    //identique précédente
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
      return decisionModule.service.fetchDecisionsToPseudonymiseBetweenDateCreation(
        {
          startDate,
          endDate,
          source,
        },
      );
    }
  },

  async fetchChainedJuricaDecisionsToPseudonymiseBetween({
    startDate,
    endDate,
  }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      logger.log({
        operationName: 'fetchChainedJuricaDecisionsToPseudonymiseBetween',
        msg:
          'Warning: The method fetchChainedJuricaDecisionsToPseudonymiseBetween is not implemented for the db_api, switching to Mongo request',
      });
    }
    return await decisionModule.service.fetchChainedJuricaDecisionsToPseudonymiseBetween(
      { startDate, endDate },
    );
  },

  async fetchCourtDecisionById({ id }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      return ((await fetchApi({
        method: 'get',
        path: `decisions/${id}/`,
        body: {},
      })) as unknown) as Promise<decisionType>;
    } else {
      return decisionModule.service.fetchCourtDecisionById(id);
    }
  },

  async fetchCourtDecisionBySourceIdAndSourceName({ sourceId, sourceName }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      logger.log({
        operationName: 'fetchCourtDecisionBySourceIdAndSourceName',
        msg:
          'Warning: The method fetchCourtDecisionBySourceIdAndSourceName is not implemented for the db_api, switching to Mongo request',
      });
    }
    return decisionModule.service.fetchDecisionBySourceIdAndSourceName(
      sourceId,
      sourceName,
    );
  },

  async setCourtDecisionsLoaded({ documents }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      documents.forEach(async (document) => {
        await fetchApi({
          method: 'put',
          path: `decisions/${document.externalId}/`,
          body: { statut: 'loaded' },
        });
      });
    } else {
      await decisionModule.service.updateDecisionsLabelStatus({
        decisionIds: documents.map((document) =>
          idModule.lib.buildId(document.externalId),
        ),
        labelStatus: 'loaded',
      });
    }
  },

  async setCourtDecisionsToBeTreated({ documents }) {
    if (process.env.DBSDER_API_ENABLED === 'true') {
      documents.forEach(async (document) => {
        await fetchApi({
          method: 'put',
          path: `decisions/${document.externalId}/`,
          body: { statut: 'toBeTreated' },
        });
      });
    } else {
      await decisionModule.service.updateDecisionsLabelStatus({
        decisionIds: documents.map((document) =>
          idModule.lib.buildId(document.externalId),
        ),
        labelStatus: 'toBeTreated',
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
      await decisionModule.service.updateDecisionsLabelStatus({
        decisionIds: [idModule.lib.buildId(externalId)],
        labelStatus: 'done',
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
      await decisionModule.service.updateDecisionsLabelStatus({
        decisionIds: [idModule.lib.buildId(externalId)],
        labelStatus: 'blocked',
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
    //TODO : manage labelTreatments before sending to dbsder-api (like in sder updateDecisionPseudonymisation function)
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
      await decisionModule.service.updateDecisionPseudonymisation({
        decisionId: idModule.lib.buildId(externalId),
        decisionPseudonymisedText: pseudonymizationText,
        labelTreatments,
        publishStatus,
      });
    }
  },
};
