import { documentType } from '@label/core';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { Deprecated } from '@label/core';
import QueryString from 'qs';

export { sderApi };

async function fetchApi<T = Record<string, unknown>>({
  method,
  path,
  body,
  query,
}: {
  method: Method;
  path: string;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
}) {
  return await axios({
    method: method,
    baseURL: `${process.env.DBSDER_API_URL}`,
    url: query ? `/${path}?${QueryString.stringify(query)}` : `/${path}`,
    data: body,
    headers: {
      'x-api-key': process.env.DBSDER_API_KEY ?? '',
    },
  })
    .then((response: AxiosResponse<T>) => {
      if (response.status != 200 && response.status != 204) {
        throw new Error(`${response.status} ${response.statusText}`);
      } else {
        return response.data;
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

async function fetchDecisions(query: Record<string, unknown>) {
  type Response = {
    decisions: Deprecated.DecisionDTO[];
    totalDecisions: number;
    nextCursor?: string;
  };
  const decisions = await fetchApi<Response>({
    method: 'get',
    path: `decisions`,
    query,
  });

  return decisions;
}

const sderApi = {
  async fetchDecisionsToPseudonymise(sourceName: string) {
    let response = await fetchDecisions({
      labelStatus: 'toBeTreated',
      sourceName,
    });
    response.decisions = response.decisions.filter(
      ({ originalText }) => !!originalText,
    );
    let index = 0;

    return {
      length: response.totalDecisions,
      next: async () => {
        const decision = response.decisions[index];
        index++;
        if (!!decision) return decision;

        if (response.nextCursor) {
          response = await fetchDecisions({
            labelStatus: 'toBeTreated',
            sourceName,
            nextCursor: response.nextCursor,
          });
          response.decisions = response.decisions.filter(
            ({ originalText }) => !!originalText,
          );
          index = 1;
          return response.decisions[0];
        }

        return undefined;
      },
    };
  },

  async fetchCourtDecisionBySourceIdAndSourceName(
    sourceId: number,
    sourceName: string,
  ): Promise<Deprecated.DecisionDTO | undefined> {
    const decisionList = await fetchDecisions({ sourceId, sourceName });

    if (decisionList.decisions.length > 0) {
      return decisionList.decisions[0];
    }
    return undefined;
  },

  async fetchDecisionByExternalId(
    externalId: documentType['externalId'],
  ): Promise<Deprecated.DecisionDTO | undefined> {
    const decision = await fetchApi<Deprecated.DecisionDTO>({
      method: 'get',
      path: `decisions/${externalId}`,
    });
    return decision;
  },

  async setCourtDecisionLoaded(externalId: string) {
    await fetchApi({
      method: 'patch',
      path: `decisions/${externalId}`,
      body: { labelStatus: 'loaded' },
    });
  },

  async updateDecisionPseudonymisation({
    externalId,
    labelTreatments,
    pseudoText,
    labelStatus,
    publishStatus,
  }: {
    externalId: documentType['externalId'];
    labelTreatments: Deprecated.LabelTreatment[];
    pseudoText: string;
    labelStatus: Deprecated.LabelStatus;
    publishStatus: Deprecated.PublishStatus;
  }) {
    await fetchApi({
      method: 'patch',
      path: `decisions/${externalId}`,
      body: {
        pseudoText,
        labelTreatments,
        labelStatus,
        publishStatus,
      },
    });
  },
};
