import {
  annotationModule,
  annotationType,
  documentType,
  idModule,
  settingsType,
} from '@label/core';
import {
  buildDocumentRepository,
  documentService,
} from '../../modules/document';
import { logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';
import { treatmentService } from '../../modules/treatment';
import { buildPreAssignator } from '../preAssignator';
import { Sources } from 'dbsder-api-types';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  return {
    importSpecificDocument,
    importNewDocuments,
  };

  async function importSpecificDocument({
    documentNumber,
    source,
    lowPriority,
    keepLabelTreatments,
    settings,
  }: {
    documentNumber: number;
    source: string;
    lowPriority: boolean;
    keepLabelTreatments: boolean;
    settings: settingsType;
  }) {
    logger.log({
      operationName: 'importSpecificDocument',
      msg: `START: ${documentNumber} - ${source}, lowPriority: ${lowPriority}, keepLabelTreatments: ${keepLabelTreatments}`,
    });

    try {
      const courtDecision = await connectorConfig.fetchCourtDecisionBySourceIdAndSourceName(
        documentNumber,
        source,
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
        await insertDocument({ ...document, route: 'exhaustive' });
      } else {
        await insertDocument({ ...document, route: 'request', priority: 4 });
      }
      logger.log({
        operationName: 'importSpecificDocument',
        msg: 'Insertion done',
      });

      if (keepLabelTreatments) {
        if (courtDecision.labelTreatments?.length == 0) {
          logger.error({
            operationName: 'importSpecificDocument',
            msg:
              'LabelTreatments not found in court decision, skiping labelTreatments reimport.',
          });
        } else {
          logger.log({
            operationName: 'importSpecificDocument',
            msg: 'LabelTreatments found in court decision, importing.',
          });

          const annotations: annotationType[] =
            courtDecision.labelTreatments == undefined
              ? []
              : courtDecision.labelTreatments[
                  courtDecision.labelTreatments.length - 1
                ].annotations.map((annotation) => {
                  return annotationModule.lib.buildAnnotation({
                    category: annotation.category,
                    start: annotation.start,
                    text: annotation.text,
                    score: annotation.score,
                    entityId: annotation.entityId,
                    source: annotation.source,
                  });
                });

          await treatmentService.createTreatment(
            {
              documentId: document._id,
              previousAnnotations: [],
              nextAnnotations: annotations,
              source: 'reimportedTreatment',
            },
            settings,
          );

          // on récupère la checklist du treatment NLP le plus récent
          const reimportedChecklist = courtDecision.labelTreatments
            ?.filter((treatment) => treatment.source === 'NLP')
            .sort((a, b) => b.order - a.order)[0].checklist;

          if (reimportedChecklist) {
            await documentService.updateDocumentChecklist(
              document._id,
              reimportedChecklist,
            );
            logger.log({
              operationName: 'importSpecificDocument',
              msg: 'Checklist reimported',
            });
          }

          logger.log({
            operationName: 'importSpecificDocument',
            msg: 'LabelTreatments reimported, checking for pre-assignation.',
          });
          const preAssignator = buildPreAssignator();
          const isPreassignated = await preAssignator.preAssignDocument(
            document,
          );
          if (!isPreassignated) {
            logger.log({
              operationName: 'importSpecificDocument',
              msg:
                'No preAssignation found, setting documentStatus to next status.',
            });
            if (lowPriority) {
              await documentService.updateDocumentStatus(
                idModule.lib.buildId(document._id),
                'free',
              );
            } else {
              await documentService.updateDocumentStatus(
                idModule.lib.buildId(document._id),
                'toBeConfirmed',
              );
            }
          }
        }
      }

      logger.log({
        operationName: 'importSpecificDocument',
        msg: 'Selected document has been inserted in label database.',
      });
      await connectorConfig.updateDocumentLabelStatusToLoaded(
        document.externalId,
      );
      logger.log({ operationName: 'importSpecificDocument', msg: 'DONE' });
    } catch (error) {
      logger.error({
        operationName: 'importSpecificDocument',
        msg: `${error}`,
        data: error as Record<string, unknown>,
      });
    }
  }

  async function importNewDocuments() {
    logger.log({
      operationName: 'importNewDocuments',
      msg: `Starting importNewDocuments...`,
    });

    for (const source of Object.values(Sources)) {
      logger.log({
        operationName: 'importNewDocuments',
        msg: `Fetching ${source} decisions...`,
      });
      const newDecisionForSource = await connectorConfig.fetchDecisionsToPseudonymise(
        source,
      );
      logger.log({
        operationName: 'importNewDocuments',
        msg: `${newDecisionForSource.length} ${source} decisions to pseudonymise found.`,
      });
      for (const decision of newDecisionForSource) {
        const converted = await connectorConfig.mapCourtDecisionToDocument(
          decision,
          'recent',
        );
        insertDocument(converted);
        await connectorConfig.updateDocumentLabelStatusToLoaded(
          converted.externalId,
        );
      }
    }
  }
}

async function insertDocument(document: documentType) {
  const documentRepository = buildDocumentRepository();

  const duplicatesDocuments = await documentRepository.findAllByExternalId(
    document.externalId,
  );
  if (duplicatesDocuments.length > 0) {
    logger.log({
      operationName: 'documentInsertion',
      msg: `Document ${document.source}:${document.documentNumber} is already ${duplicatesDocuments.length} time in label database, deleting not rejected documents`,
    });

    for (const doc of duplicatesDocuments) {
      if (doc.status !== 'rejected') {
        await documentService.deleteDocument(doc._id);
      }
    }
  }

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
  } catch (error) {
    logger.error({
      operationName: 'documentInsertion',
      msg: `Failed to import ${document.source}:${document.documentNumber} document. ${error}`,
      data: {
        decision: {
          sourceId: document.documentNumber,
          sourceName: document.source,
        },
      },
    });
  }
}
