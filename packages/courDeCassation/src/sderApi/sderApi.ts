import { documentType } from '@label/core';
import axios, { AxiosError, AxiosResponse, Method } from 'axios';
import { Deprecated } from '@label/core';

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

const sderApi = {
  async fetchDecisionsToPseudonymise(
    sourceName: string,
  ): Promise<Deprecated.DecisionDTO[]> {
    const decisionList = ((await fetchApi({
      method: 'get',
      path: `decisions?status=toBeTreated&sourceName=${sourceName}`,
      body: {},
    })) as unknown) as {
      _id: string;
      status: string;
      sourceName: string;
      dateCreation: string;
    }[];

    if (!decisionList.length) {
      return [];
    }

    const decisions = await Promise.all(
      decisionList.map(async (decisionRef) => {
        return ((await fetchApi({
          method: 'get',
          path: `decisions/${decisionRef['_id']}`,
          body: {},
        })) as unknown) as Deprecated.DecisionDTO;
      }),
    );

    return decisions;
  },

  async fetchCourtDecisionBySourceIdAndSourceName(
    sourceId: number,
    sourceName: string,
  ): Promise<Deprecated.DecisionDTO | undefined> {
    const decisionList = ((await fetchApi({
      method: 'get',
      path: `decisions?&sourceId=${sourceId}&sourceName=${sourceName}`,
      body: {},
    })) as unknown) as {
      _id: string;
      status: string;
      sourceName: string;
      dateCreation: string;
    }[];
    if (decisionList.length > 0) {
      return ((await fetchApi({
        method: 'get',
        path: `decisions/${decisionList[0]['_id']}`,
        body: {},
      })) as unknown) as Deprecated.DecisionDTO;
    }
    return undefined;
  },

  async setCourtDecisionLoaded(externalId: string) {
    await fetchApi({
      method: 'put',
      path: `decisions/${externalId}/statut`,
      body: { statut: 'loaded' },
    });
  },

  async updateDecisionPseudonymisation({
    externalId,
    labelTreatments,
    pseudoText,
  }: {
    externalId: documentType['externalId'];
    labelTreatments: Deprecated.LabelTreatment[];
    pseudoText: string;
  }) {
    await fetchApi({
      method: 'put',
      path: `decisions/${externalId}/decision-pseudonymisee`,
      body: {
        pseudoText,
        labelTreatments,
      },
    });
  },
};
