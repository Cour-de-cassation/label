import {
  annotationModule,
  annotationType,
  documentType,
  settingsType,
} from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';
import { connectorConfigType } from './connectorConfigType';
import { treatmentService } from '../../modules/treatment';
import { buildPreAssignator } from '../preAssignator';
import { Sources } from 'dbsder-api-types';

export { buildConnector };

function buildConnector(connectorConfig: connectorConfigType) {
  const preAssignator = buildPreAssignator();

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

      if (
        !courtDecision.originalText ||
        !courtDecision.labelTreatments ||
        courtDecision.labelTreatments.length === 0
      ) {
        logger.log({
          operationName: 'importSpecificDocument',
          msg:
            'Court decision must have an original text and labelTreatments, skipping.',
        });
        return;
      }

      logger.log({
        operationName: 'importSpecificDocument',
        msg: `Court decision found. labelStatus: ${courtDecision.labelStatus}`,
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
        await insertDocument({
          ...document,
          route: 'request',
          priority: 4,
          status: 'toBeConfirmed',
        });
      }
      logger.log({
        operationName: 'importSpecificDocument',
        msg: 'Insertion done',
      });

      // If keepLabelTreatments reimport last treatment, otherwise reimport last NLP treatment
      if (keepLabelTreatments) {
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
                  certaintyScore: 1,
                  entityId: annotation.entityId,
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

        logger.log({
          operationName: 'importSpecificDocument',
          msg: 'Last labelTreatment reimported.',
        });
      } else {
        const lastNlpLabelTreatment = courtDecision.labelTreatments
          ?.filter((treatment) => treatment.source === 'NLP')
          .sort((a, b) => b.order - a.order)[0];

        if (!lastNlpLabelTreatment) {
          logger.log({
            operationName: 'importSpecificDocument',
            msg: 'Court decision must have an NLP, skipping.',
          });
          return;
        }

        const annotations: annotationType[] = lastNlpLabelTreatment.annotations.map(
          (annotation) => {
            return annotationModule.lib.buildAnnotation({
              category: annotation.category,
              start: annotation.start,
              text: annotation.text,
              certaintyScore: annotation.certaintyScore,
              entityId: annotation.entityId,
            });
          },
        );

        await treatmentService.createTreatment(
          {
            documentId: document._id,
            previousAnnotations: [],
            nextAnnotations: annotations,
            source: 'NLP',
          },
          settings,
        );
      }

      await preAssignator.preAssignDocument(document);

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

  async function importNewDocuments(settings: settingsType) {
    logger.log({
      operationName: 'importNewDocuments',
      msg: `Starting importNewDocuments...`,
    });

    for (const source of Object.values(Sources)) {
      // Skip juritcom import in prod, delete the condition to activate juritcom import
      if (process.env.GIT_BRANCH === 'prod' && source === Sources.TCOM) {
        logger.log({
          operationName: 'importNewDocuments',
          msg: `Skipping ${source} decisions in prod environment.`,
        });
        continue;
      }

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
      for (const courtDecision of newDecisionForSource) {
        if (
          !courtDecision.originalText ||
          !courtDecision.labelTreatments ||
          courtDecision.labelTreatments.length === 0
        ) {
          logger.log({
            operationName: 'importNewDocuments',
            msg:
              'Court decision must have an original text and labelTreatments, skipping.',
          });
          return;
        }

        const document = await connectorConfig.mapCourtDecisionToDocument(
          courtDecision,
          'recent',
        );
        insertDocument(document);

        const lastNlpLabelTreatment = courtDecision.labelTreatments
          ?.filter((treatment) => treatment.source === 'NLP')
          .sort((a, b) => b.order - a.order)[0];

        if (!lastNlpLabelTreatment) {
          logger.log({
            operationName: 'importNewDocuments',
            msg: 'Court decision must have an NLP treatment, skipping.',
          });
          return;
        }

        const annotations: annotationType[] = lastNlpLabelTreatment.annotations.map(
          (annotation) => {
            return annotationModule.lib.buildAnnotation({
              category: annotation.category,
              start: annotation.start,
              text: annotation.text,
              certaintyScore: annotation.certaintyScore,
              entityId: annotation.entityId,
            });
          },
        );

        await treatmentService.createTreatment(
          {
            documentId: document._id,
            previousAnnotations: [],
            nextAnnotations: annotations,
            source: 'NLP',
          },
          settings,
        );

        await preAssignator.preAssignDocument(document);

        await connectorConfig.updateDocumentLabelStatusToLoaded(
          document.externalId,
        );
      }
    }
  }
}

async function insertDocument(document: documentType) {
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
