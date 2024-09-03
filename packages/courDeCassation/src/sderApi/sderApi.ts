import axios, {AxiosError, AxiosResponse, Method} from 'axios';
import {decisionModule, decisionType} from 'sder';
import {idModule} from '@label/core';
import {sderApiType} from './sderApiType';

export {sderApi};

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
        return decisions.filter((item) => {
            // Check for jurisdiction match
            const jurisdictionMatch =
                jurisdictions.includes(item.jurisdictionCode) ||
                jurisdictions.includes(item.jurisdictionId) ||
                jurisdictions.includes(item.jurisdictionName);

            // Check for chamber match
            const chamberMatch =
                chambers.includes(item.chamberId) ||
                chambers.includes(item.chamberName);

            // Return true if both match
            return jurisdictionMatch && chamberMatch;
        });
    },

    async fetchDecisionsToPseudonymiseBetween({startDate, endDate, source}) {
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
    },

    async fetchDecisionsToPseudonymiseBetweenDateCreation({
                                                              //identique précédente
                                                              startDate,
                                                              endDate,
                                                              source,
                                                          }) {
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
    },

    async fetchChainedJuricaDecisionsToPseudonymiseBetween({
                                                               startDate,
                                                               endDate,
                                                           }) {
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
        const decisions: decisionType[] = [];
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
                    decisions.push(decision as decisionType);
                }
            }
        }
        return decisions;
    },

    async fetchCourtDecisionById({id}) {
        return ((await fetchApi({
            method: 'get',
            path: `decisions/${id}/`,
            body: {},
        })) as unknown) as Promise<decisionType>;
    },

    async fetchCourtDecisionBySourceIdAndSourceName({sourceId, sourceName}) {
        const decisionList = ((await fetchApi({
            method: 'get',
            path: `decisions?status=toBeTreated&sourceId=${sourceId}&sourceName=${sourceName}`,
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
        return decisions.length > 0 ? decisions[0] : undefined;
    },

    async setCourtDecisionsLoaded({documents}) {
        if (process.env.DBSDER_API_ENABLED === 'true') {
            documents.forEach(async (document) => {
                await fetchApi({
                    method: 'put',
                    path: `decisions/${document.externalId}/`,
                    body: {statut: 'loaded'},
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

    async setCourtDecisionsToBeTreated({documents}) {
        documents.forEach(async (document) => {
            await fetchApi({
                method: 'put',
                path: `decisions/${document.externalId}/`,
                body: {statut: 'toBeTreated'},
            });
        });
    },

    async setCourtDecisionDone({externalId}) {
        await fetchApi({
            method: 'put',
            path: `decisions/${externalId}/`,
            body: {statut: 'done'},
        });
    },

    async setCourtDecisionBlocked({externalId}) {
        await fetchApi({
            method: 'put',
            path: `decisions/${externalId}/`,
            body: {statut: 'blocked'},
        });
    },

    async updateDecisionPseudonymisation({
                                             externalId,
                                             labelTreatments,
                                             pseudonymizationText,
                                             publishStatus,
                                         }) {
        //TODO : include publishStatus to dbsder api call
        //TODO : manage labelTreatments before sending to dbsder-api (like in sder updateDecisionPseudonymisation function)
        await fetchApi({
            method: 'put',
            path: `decisions/${externalId}/rapports-occultations`,
            body: {rapportsOccultations: labelTreatments},
        });
        await fetchApi({
            method: 'put',
            path: `decisions/${externalId}/decision-pseudonymisee`,
            body: {decisionPseudonymisee: pseudonymizationText},
        });
    },
};
