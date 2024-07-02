import { dateBuilder, documentType, idModule, timeOperator } from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';
import { decisionType } from 'sder';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  return {
    importChainedDocumentsFromSder,
    importSpecificDocument,
    importNewDocuments,
    importDocumentsByJurisdictionBetween,
    importDocumentsSinceOrBetween,
    resetDocument,
    resetAllDocumentsSince,
    deleteDocumentsOlderThan,
    resetAllLockedDocuments,
  };

  async function importChainedDocumentsFromSder({
    documentsCount,
    threshold,
  }: {
    documentsCount: number;
    threshold: number;
  }) {
    logger.log({
      operationName: 'importChainedDocumentsFromSder',
      msg: `Import chained documents from sder with ${threshold} threshold`,
    });

    const documentRepository = buildDocumentRepository();

    const documentsToTreat = await documentRepository.findAllByStatusProjection(
      ['loaded', 'nlpAnnotating', 'free'],
      ['_id'],
    );

    if (documentsToTreat.length > threshold) {
      return;
    }
    const daysStep = 30;

    await importChainedDocuments(documentsCount, daysStep);
  }

  async function importSpecificDocument({
    documentNumber,
    source,
    lowPriority,
  }: {
    documentNumber: number;
    source: string;
    lowPriority: boolean;
  }) {
    logger.log({
      operationName: 'importSpecificDocument',
      msg: `START: ${documentNumber} - ${source}, lowPriority: ${lowPriority}`,
    });

    try {
      const courtDecision = await connectorConfig.fetchCourtDecisionBySourceIdAndSourceName(
        {
          sourceId: documentNumber,
          sourceName: source,
        },
      );

      if (!courtDecision) {
        logger.log({
          operationName: 'importSpecificDocument',
          msg:
            'No court decision found for specified documentNumber and source',
        });
        return;
      }

      logger.log({
        operationName: 'importSpecificDocument',
        msg: `Court decision found. labelStatus: ${
          courtDecision.labelStatus
        }, ${!!courtDecision.pseudoText ? 'already' : 'never'} pseudonymised`,
      });
      const document = await connectorConfig.mapCourtDecisionToDocument(
        courtDecision,
        'manual',
      );
      logger.log({
        operationName: 'importSpecificDocument',
        msg: 'Court decision converted. Inserting document into database...',
      });
      if (lowPriority) {
        await insertDocument({ ...document });
      } else {
        await insertDocument({ ...document, route: 'request', priority: 4 });
      }
      logger.log({
        operationName: 'importSpecificDocument',
        msg: 'Insertion done',
      });

      logger.log({
        operationName: 'importSpecificDocument',
        msg: 'Send document has been loaded...',
      });
      await connectorConfig.updateDocumentsLoadedStatus({
        documents: [document],
      });
      logger.log({ operationName: 'importSpecificDocument', msg: 'DONE' });
    } catch (error) {
      logger.error({
        operationName: 'importSpecificDocument',
        msg: 'Error',
        data: error as Record<string, unknown>,
      });
    }
  }

  async function importNewDocuments({
    documentsCount,
    threshold,
    sources,
    daysStep,
  }: {
    documentsCount: number;
    threshold?: number;
    sources?: decisionType['sourceName'][];
    daysStep?: number;
  }) {
    const DEFAULT_DAYS_STEP = 30;
    const MAX_STEP = 300;
    logger.log({
      operationName: 'importNewDocuments',
      msg: `START: ${documentsCount} - ${
        sources?.join('/') ?? 'all sources'
      } - ${daysStep || DEFAULT_DAYS_STEP}`,
    });

    if (threshold) {
      const documentRepository = buildDocumentRepository();
      const documentsToTreat = await documentRepository.findAllByStatusProjection(
        ['loaded', 'nlpAnnotating', 'free'],
        ['_id'],
      );

      if (documentsToTreat.length > threshold) {
        logger.log({
          operationName: 'importNewDocuments',
          msg: `Threshold not met`,
        });
        logger.log({ operationName: 'importNewDocuments', msg: 'DONE' });
        return 0;
      }
    }

    logger.log({
      operationName: 'importNewDocuments',
      msg: `Fetching ${connectorConfig.name} decisions...`,
    });
    let daysAgo = 0;
    let step = 0;
    let newDocuments: documentType[] = [];
    while (newDocuments.length < documentsCount && step < MAX_STEP) {
      const startDate = new Date(
        dateBuilder.daysAgo(daysAgo + (daysStep || DEFAULT_DAYS_STEP)),
      );
      const endDate = new Date(dateBuilder.daysAgo(daysAgo));
      try {
        const newCourtDecisions: decisionType[] = [];
        if (!sources || sources.includes('jurinet')) {
          const newJurinetDecisions = await connectorConfig.fetchDecisionsToPseudonymiseBetween(
            {
              startDate,
              endDate,
              source: 'jurinet',
            },
          );
          newJurinetDecisions && newCourtDecisions.push(...newJurinetDecisions);
        }
        if (!sources || sources.includes('jurica')) {
          const newJuricaDecisions = await connectorConfig.fetchDecisionsToPseudonymiseBetween(
            {
              startDate,
              endDate,
              source: 'jurica',
            },
          );
          newJuricaDecisions && newCourtDecisions.push(...newJuricaDecisions);
        }
        if (!sources || sources.includes('juritj')) {
          const newJuritjDecisions = await connectorConfig.fetchDecisionsToPseudonymiseBetween(
            {
              startDate,
              endDate,
              source: 'juritj',
            },
          );
          newJuritjDecisions && newCourtDecisions.push(...newJuritjDecisions);
        }

        logger.log({
          operationName: 'importNewDocuments',
          msg: `${newCourtDecisions.length} ${
            connectorConfig.name
          } court decisions fetched between ${timeOperator.convertTimestampToReadableDate(
            startDate.getTime(),
          )} and ${timeOperator.convertTimestampToReadableDate(
            endDate.getTime(),
          )}!`,
        });
        for (const courtDecision of newCourtDecisions) {
          newDocuments.push(
            await connectorConfig.mapCourtDecisionToDocument(
              courtDecision,
              'filler',
            ),
          );
        }
      } catch (error) {
        if (newDocuments.length) {
          logger.error({
            operationName: 'importNewDocuments',
            msg: `Error ${error}, stopping import loop at this step`,
          });
          step = MAX_STEP;
        } else {
          throw new Error(`${error}`);
        }
      }
      daysAgo += daysStep || DEFAULT_DAYS_STEP;
      step++;
    }

    newDocuments = newDocuments.slice(0, documentsCount);

    logger.log({
      operationName: 'importNewDocuments',
      msg: `Insertion ${newDocuments.length} documents into the database...`,
    });
    await insertDocuments(newDocuments);
    logger.log({ operationName: 'importNewDocuments', msg: `Insertion done!` });

    logger.log({
      operationName: 'importNewDocuments',
      msg: `Send documents have been loaded...`,
    });
    await connectorConfig.updateDocumentsLoadedStatus({
      documents: newDocuments,
    });
    logger.log({ operationName: 'importNewDocuments', msg: 'DONE' });
    return newDocuments.length;
  }

  async function importChainedDocuments(
    documentCount: number,
    daysStep?: number,
  ) {
    const DEFAULT_DAYS_STEP = 30;
    const MAX_STEP = 300;
    logger.log({
      operationName: 'importNewDocuments',
      msg: `importChainedDocuments: ${documentCount} - ${
        daysStep || DEFAULT_DAYS_STEP
      }`,
    });

    logger.log({
      operationName: 'importChainedDocuments',
      msg: `Fetching ${connectorConfig.name} documents...`,
    });
    let daysAgo = 0;
    let step = 0;
    let newDocuments: documentType[] = [];
    let importedDocuments: documentType[] = [];
    while (importedDocuments.length < documentCount && step < MAX_STEP) {
      const startDate = new Date(
        dateBuilder.daysAgo(daysAgo + (daysStep || DEFAULT_DAYS_STEP)),
      );
      const endDate = new Date(dateBuilder.daysAgo(daysAgo));
      try {
        const newCourtDecisions =
          (await connectorConfig.fetchChainedJuricaDecisionsToPseudonymiseBetween(
            {
              startDate,
              endDate,
            },
          )) ?? [];
        logger.log({
          operationName: 'importChainedDocuments',
          msg: `${newCourtDecisions.length} ${
            connectorConfig.name
          } court decisions fetched between ${timeOperator.convertTimestampToReadableDate(
            startDate.getTime(),
          )} and ${timeOperator.convertTimestampToReadableDate(
            endDate.getTime(),
          )}!`,
        });
        for (const courtDecision of newCourtDecisions) {
          newDocuments.push(
            await connectorConfig.mapCourtDecisionToDocument(
              courtDecision,
              'chained',
            ),
          );
        }

        newDocuments = newDocuments.slice(0, documentCount);

        logger.log({
          operationName: 'importNewDocuments',
          msg: `Insertion ${newDocuments.length} documents into the database...`,
        });
        await insertDocuments(newDocuments);
        logger.log({
          operationName: 'importChainedDocuments',
          msg: `Insertion done!`,
        });

        logger.log({
          operationName: 'importChainedDocuments',
          msg: `Send documents have been loaded...`,
        });
        await connectorConfig.updateDocumentsLoadedStatus({
          documents: newDocuments,
        });

        importedDocuments = [...importedDocuments, ...newDocuments];
      } catch (error) {
        logger.error({
          operationName: 'importChainedDocuments',
          msg: 'Error',
          data: error as Record<string, unknown>,
        });
      }
      newDocuments = [];
      daysAgo += daysStep || DEFAULT_DAYS_STEP;
      step++;
    }

    logger.log({ operationName: 'importChainedDocuments', msg: 'DONE' });
    return importedDocuments.length;
  }

  async function importDocumentsSinceOrBetween({
    fromDaysAgo,
    toDaysAgo,
    byDateCreation,
  }: {
    fromDaysAgo: number;
    toDaysAgo?: number;
    byDateCreation: boolean;
  }) {
    toDaysAgo
      ? logger.log({
          operationName: 'importDocumentsSinceOrBetween',
          msg: `Importation by scope from ${fromDaysAgo} days ago to ${toDaysAgo} days ago - byDateCreation : ${byDateCreation}`,
        })
      : logger.log({
          operationName: 'importDocumentsSinceOrBetween',
          msg: `Importation since ${fromDaysAgo} days - byDateCreation : ${byDateCreation}`,
        });

    const newCourtDecisions = [];
    try {
      logger.log({
        operationName: 'importDocumentsSinceOrBetween',
        msg: `Fetching ${connectorConfig.name} jurinet documents...`,
      });
      const newJurinetCourtDecisions =
        (byDateCreation
          ? await connectorConfig.fetchDecisionsToPseudonymiseBetweenDateCreation(
              {
                startDate: new Date(dateBuilder.daysAgo(fromDaysAgo)),
                endDate: toDaysAgo
                  ? new Date(dateBuilder.daysAgo(toDaysAgo))
                  : new Date(),
                source: 'jurinet',
              },
            )
          : await connectorConfig.fetchDecisionsToPseudonymiseBetween({
              startDate: new Date(dateBuilder.daysAgo(fromDaysAgo)),
              endDate: toDaysAgo
                ? new Date(dateBuilder.daysAgo(toDaysAgo))
                : new Date(),
              source: 'jurinet',
            })) ?? [];
      logger.log({
        operationName: 'importDocumentsSinceOrBetween',
        msg: `${newJurinetCourtDecisions.length} ${connectorConfig.name} court decisions fetched from jurinet!`,
      });
      newCourtDecisions.push(...newJurinetCourtDecisions);
    } catch (error) {
      logger.error({
        operationName: 'importDocumentsSinceOrBetween',
        msg: 'Error',
        data: error as Record<string, unknown>,
      });
    }
    try {
      logger.log({
        operationName: 'importDocumentsSinceOrBetween',
        msg: `Fetching ${connectorConfig.name} jurica documents...`,
      });
      const newJuricaCourtDecisions =
        (byDateCreation
          ? await connectorConfig.fetchDecisionsToPseudonymiseBetweenDateCreation(
              {
                startDate: new Date(dateBuilder.daysAgo(fromDaysAgo)),
                endDate: toDaysAgo
                  ? new Date(dateBuilder.daysAgo(toDaysAgo))
                  : new Date(),
                source: 'jurica',
              },
            )
          : await connectorConfig.fetchDecisionsToPseudonymiseBetween({
              startDate: new Date(dateBuilder.daysAgo(fromDaysAgo)),
              endDate: toDaysAgo
                ? new Date(dateBuilder.daysAgo(toDaysAgo))
                : new Date(),
              source: 'jurica',
            })) ?? [];
      logger.log({
        operationName: 'importDocumentsSinceOrBetween',
        msg: `${newJuricaCourtDecisions.length} ${connectorConfig.name} court decisions fetched from jurica!`,
      });
      newCourtDecisions.push(...newJuricaCourtDecisions);
    } catch (error) {
      logger.error({
        operationName: 'importDocumentsSinceOrBetween',
        msg: 'Error',
        data: error as Record<string, unknown>,
      });
    }
    try {
      logger.log({
        operationName: 'importDocumentsSinceOrBetween',
        msg: `Fetching ${connectorConfig.name} juritj documents...`,
      });
      const newJuritjCourtDecisions =
        (byDateCreation
          ? await connectorConfig.fetchDecisionsToPseudonymiseBetweenDateCreation(
              {
                startDate: new Date(dateBuilder.daysAgo(fromDaysAgo)),
                endDate: toDaysAgo
                  ? new Date(dateBuilder.daysAgo(toDaysAgo))
                  : new Date(),
                source: 'juritj',
              },
            )
          : await connectorConfig.fetchDecisionsToPseudonymiseBetween({
              startDate: new Date(dateBuilder.daysAgo(fromDaysAgo)),
              endDate: toDaysAgo
                ? new Date(dateBuilder.daysAgo(toDaysAgo))
                : new Date(),
              source: 'juritj',
            })) ?? [];
      logger.log({
        operationName: 'importDocumentsSinceOrBetween',
        msg: `${newJuritjCourtDecisions.length} ${connectorConfig.name} court decisions fetched from juritj!`,
      });
      newCourtDecisions.push(...newJuritjCourtDecisions);
    } catch (error) {
      logger.error({
        operationName: 'importDocumentsSinceOrBetween',
        msg: 'Error',
        data: error as Record<string, unknown>,
      });
    }
    const documents = [] as documentType[];
    for (const courtDecision of newCourtDecisions) {
      documents.push(
        await connectorConfig.mapCourtDecisionToDocument(
          courtDecision,
          'recent',
        ),
      );
    }

    logger.log({
      operationName: 'importDocumentsSinceOrBetween',
      msg: `Insertion ${documents.length} documents into the database...`,
    });
    await insertDocuments(documents);
    logger.log({
      operationName: 'importDocumentsSinceOrBetween',
      msg: `Insertion done!`,
    });

    logger.log({
      operationName: 'importDocumentsSinceOrBetween',
      msg: `Send documents have been loaded...`,
    });
    await connectorConfig.updateDocumentsLoadedStatus({
      documents,
    });
    logger.log({ operationName: 'importDocumentsSinceOrBetween', msg: 'DONE' });
  }

  async function importDocumentsByJurisdictionBetween(
    from: Date,
    to: Date,
    jurisdictions: string[],
    chambers: string[],
  ) {
    logger.log({
      operationName: 'importDocumentsByJurisdictionBetween',
      msg: `START: from:${from} to:${to} with jurisdiction=${jurisdictions.join(
        ',',
      )} & chambers=${chambers.join(',')}`,
    });
    const newCourtDecisions = [];
    try {
      logger.log({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: `Fetching ${connectorConfig.name} jurinet documents...`,
      });
      const newJurinetCourtDecisions =
        (await connectorConfig.fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween(
          {
            startDate: from,
            endDate: to,
            source: 'jurinet',
            jurisdictions,
            chambers,
          },
        )) ?? [];
      logger.log({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: `${newJurinetCourtDecisions.length} ${connectorConfig.name} court decisions fetched from jurinet!`,
      });
      newCourtDecisions.push(...newJurinetCourtDecisions);
    } catch (error) {
      logger.error({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: 'Error',
        data: error as Record<string, unknown>,
      });
    }
    try {
      logger.log({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: `Fetching ${connectorConfig.name} jurica documents...`,
      });
      const newJuricaCourtDecisions =
        (await connectorConfig.fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween(
          {
            startDate: from,
            endDate: to,
            source: 'jurica',
            jurisdictions,
            chambers,
          },
        )) ?? [];
      logger.log({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: `${newJuricaCourtDecisions.length} ${connectorConfig.name} court decisions fetched from jurica!`,
      });
      newCourtDecisions.push(...newJuricaCourtDecisions);
      logger.log({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: `Fetching ${connectorConfig.name} juritj documents...`,
      });
    } catch (error) {
      logger.error({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: 'Error',
        data: error as Record<string, unknown>,
      });
    }
    try {
      const newJuritjCourtDecisions =
        (await connectorConfig.fetchAllDecisionsBySourceAndJurisdictionsAndChambersBetween(
          {
            startDate: from,
            endDate: to,
            source: 'juritj',
            jurisdictions,
            chambers,
          },
        )) ?? [];
      logger.log({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: `${newJuritjCourtDecisions.length} ${connectorConfig.name} court decisions fetched from juritj!`,
      });
      newCourtDecisions.push(...newJuritjCourtDecisions);
    } catch (error) {
      logger.error({
        operationName: 'importDocumentsByJurisdictionBetween',
        msg: 'Error',
        data: error as Record<string, unknown>,
      });
    }
    const documents = [] as documentType[];
    for (const courtDecision of newCourtDecisions) {
      documents.push(
        await connectorConfig.mapCourtDecisionToDocument(
          courtDecision,
          'recent',
        ),
      );
    }

    logger.log({
      operationName: 'importDocumentsByJurisdictionBetween',
      msg: `Insertion ${documents.length} documents into the database...`,
    });
    await insertDocuments(documents);
    logger.log({
      operationName: 'importDocumentsByJurisdictionBetween',
      msg: `Insertion done!`,
    });

    logger.log({
      operationName: 'importDocumentsByJurisdictionBetween',
      msg: `Send documents have been loaded...`,
    });
    await connectorConfig.updateDocumentsLoadedStatus({
      documents,
    });
    logger.log({
      operationName: 'importDocumentsByJurisdictionBetween',
      msg: 'DONE',
    });
  }

  async function deleteDocumentsOlderThan({
    days,
    source,
  }: {
    days: number;
    source: string;
  }) {
    logger.log({
      operationName: 'deleteDocumentsOlderThan',
      msg: `deleteDocumentsOlderThan: days ${days}, source ${source}`,
    });
    const documentRepository = buildDocumentRepository();
    const documents = await documentRepository.findAll();
    logger.log({
      operationName: 'deleteDocumentsOlderThan',
      msg: `Found ${documents.length} documents. Filtering...`,
    });
    const filteredDocuments = documents?.filter(
      (document) =>
        document.source === source &&
        document.creationDate &&
        document.creationDate < dateBuilder.daysAgo(days),
    );
    logger.log({
      operationName: 'deleteDocumentsOlderThan',
      msg: `Found ${filteredDocuments} to reset. Resetting their status in SDER...`,
    });
    await connectorConfig.updateDocumentsToBeTreatedStatus({
      documents: filteredDocuments,
    });
    logger.log({
      operationName: 'deleteDocumentsOlderThan',
      msg:
        'Documents status updated! Deleting the documents in the database...',
    });
    for (let i = 0, l = filteredDocuments.length; i < l; i++) {
      logger.log({
        operationName: 'deleteDocumentsOlderThan',
        msg: `Deleting document ${i + 1}/${l}...`,
      });
      try {
        await documentService.deleteDocument(filteredDocuments[i]._id);
      } catch (error) {
        logger.error({
          operationName: 'deleteDocumentsOlderThan',
          msg: `An error happened while deleting the document`,
          data: error as Record<string, unknown>,
        });
      }
    }
    logger.log({ operationName: 'deleteDocumentsOlderThan', msg: 'DONE' });
  }

  async function resetAllDocumentsSince({ days }: { days: number }) {
    const documentRepository = buildDocumentRepository();

    const documents = await documentRepository.findAll();
    logger.log({
      operationName: 'resetAllDocumentsSince',
      msg: `Found ${documents.length} in the DB. Filtering the documents to reset...`,
    });

    const documentsToReset = documents?.filter(
      (document) =>
        document.creationDate &&
        document.creationDate >= dateBuilder.daysAgo(days) &&
        document.status !== 'done' &&
        document.status !== 'toBePublished',
    );
    logger.log({
      operationName: 'resetAllDocumentsSince',
      msg: `Found ${documentsToReset.length} in the DB. Updating their status to toBeTreated in SDER DB...`,
    });

    await connectorConfig.updateDocumentsToBeTreatedStatus({
      documents: documentsToReset,
    });
    logger.log({
      operationName: 'resetAllDocumentsSince',
      msg:
        'Documents status updated! Deleting the documents in the Database...',
    });

    for (let i = 0, l = documentsToReset.length; i < l; i++) {
      try {
        const documentIdToReset = documentsToReset[i]._id;
        logger.log({
          operationName: 'resetAllDocumentsSince',
          msg: `Deleting document ${idModule.lib.convertToString(
            documentIdToReset,
          )}: ${i + 1}/${l}...`,
        });
        await documentService.deleteDocument(documentIdToReset);
      } catch (error) {
        logger.error({
          operationName: 'resetAllDocumentsSince',
          msg: `An error happened while deleting the document`,
        });
      }
    }
  }

  async function resetAllLockedDocuments() {
    logger.log({ operationName: 'resetAllLockedDocuments', msg: 'START' });

    const documentRepository = buildDocumentRepository();
    const lockedDocuments = await documentRepository.findAllByStatusProjection(
      ['locked'],
      ['_id'],
    );

    logger.log({
      operationName: 'resetAllLockedDocuments',
      msg: `Reseting ${lockedDocuments.length} locked documents...`,
    });

    const lockedDocumentIds = lockedDocuments.map(({ _id }) => _id);
    for (let i = 0, length = lockedDocuments.length; i < length; i++) {
      await documentService.updateDocumentStatus(
        lockedDocumentIds[i],
        'loaded',
      );
    }

    logger.log({ operationName: 'resetAllLockedDocuments', msg: 'DONE' });
  }

  async function resetDocument({
    documentNumber,
    source,
  }: {
    documentNumber: documentType['documentNumber'];
    source: documentType['source'];
  }) {
    const documentRepository = buildDocumentRepository();

    const document = await documentRepository.findOneByDocumentNumberAndSource({
      documentNumber,
      source,
    });
    if (!document) {
      logger.log({
        operationName: 'resetDocument',
        msg: `Could not find document ${documentNumber} from source "${source}"`,
      });
      return;
    }
    logger.log({
      operationName: 'resetDocument',
      msg: `Document found in the DB. Resetting the status to "toBeTreated"`,
    });

    await connectorConfig.updateDocumentsToBeTreatedStatus({
      documents: [document],
    });
    logger.log({
      operationName: 'resetDocument',
      msg: 'Documents status updated! Deleting the document in the Database...',
    });

    try {
      await documentService.deleteDocument(document._id);
    } catch (error) {
      logger.error({
        operationName: 'resetDocument',
        msg: `An error happened while deleting the document`,
      });
    }
    logger.log({
      operationName: 'resetDocument',
      msg: `Document deleted. Importing the new version of the document...`,
    });

    await importSpecificDocument({
      documentNumber,
      source,
      lowPriority: true,
    });
  }
}

async function insertDocuments(documents: documentType[]) {
  const documentRepository = buildDocumentRepository();

  for await (const document of documents) {
    try {
      await documentRepository.insert(document);
      logger.log({
        operationName: 'documentInsertion',
        msg: `Document ${document.source}:${document.documentNumber} has been inserted in database imported by ${document.importer}`,
        data: {
          decision: {
            sourceId: document.documentNumber,
            sourceName: document.source,
          },
        },
      });
    } catch {
      logger.error({
        operationName: 'documentInsertion',
        msg: `Failed to import ${document.source}:${document.documentNumber} document`,
        data: {
          decision: {
            sourceId: document.documentNumber,
            sourceName: document.source,
          },
        },
      });
    }
  }
}

function insertDocument(document: documentType) {
  const documentRepository = buildDocumentRepository();

  try {
    const insertedDocument = documentRepository.insert(document);
    logger.log({
      operationName: 'documentInsertion',
      msg: `Document ${document.source}:${document.documentNumber} has been inserted in database imported by ${document.importer}`,
      data: {
        decision: {
          sourceId: document.documentNumber,
          sourceName: document.source,
        },
      },
    });
    return insertedDocument;
  } catch {
    logger.error({
      operationName: 'documentInsertion',
      msg: `Failed to import ${document.source}:${document.documentNumber} document`,
      data: {
        decision: {
          sourceId: document.documentNumber,
          sourceName: document.source,
        },
      },
    });
  }
}
