import { promises as fs } from 'fs';
import { csvExtractor, documentType } from '@label/core';
import { buildDocumentRepository } from '../../modules/document';
import { logger } from '../../utils';

export { extractRouteInfosIntoCsv };

type routeInfoType = {
  route: documentType['route'];
  documentNumber: documentType['documentNumber'];
  session: documentType['decisionMetadata']['session'];
  solution: documentType['decisionMetadata']['solution'];
  publicationCategory: documentType['publicationCategory'];
  chamberName: documentType['decisionMetadata']['chamberName'];
  civilMatterCode: documentType['decisionMetadata']['civilMatterCode'];
  civilCaseCode: documentType['decisionMetadata']['civilCaseCode'];
  criminalCaseCode: documentType['decisionMetadata']['criminalCaseCode'];
  source: documentType['source'];
};

async function extractRouteInfosIntoCsv() {
  logger.log(`extractRouteInfosIntoCsv`);

  const fileName = 'routeInfos.csv';

  const documentRepository = buildDocumentRepository();

  const documents = await documentRepository.findAllProjection([
    'decisionMetadata',
    'publicationCategory',
    'source',
    'creationDate',
    'route',
    'documentNumber',
  ]);

  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(1);

  const documentsToStore = documents.filter(
    ({ source, creationDate }) =>
      source === 'jurinet' && creationDate && creationDate > now.getTime(),
  );

  const routeInfos = documentsToStore.map((document) => {
    return {
      documentNumber: document.documentNumber,
      solution: document.decisionMetadata.solution,
      session: document.decisionMetadata.session,
      publicationCategory: document.publicationCategory,
      chamberName: document.decisionMetadata.chamberName,
      civilMatterCode: document.decisionMetadata.civilMatterCode,
      civilCaseCode: document.decisionMetadata.civilCaseCode,
      criminalCaseCode: document.decisionMetadata.criminalCaseCode,
      source: document.source,
      route: document.route,
    };
  });

  const csvContent = convertRouteInfosToCsvContent(routeInfos);

  try {
    await fs.writeFile(`./${fileName}`, csvContent);
  } catch (err) {
    logger.error(err);
  }
}

function convertRouteInfosToCsvContent(routeInfos: routeInfoType[]) {
  const CSV_FIELDS: Array<{
    title: string;
    extractor: (routeInfo: routeInfoType) => string;
  }> = [
    {
      title: 'route',
      extractor: (routeInfo) => routeInfo.route,
    },
    {
      title: 'documentNumber',
      extractor: (routeInfo) => routeInfo.documentNumber.toString(),
    },
    { title: 'solution', extractor: (routeInfo) => routeInfo.solution },
    { title: 'session', extractor: (routeInfo) => routeInfo.session },
    {
      title: 'publicationCategory',
      extractor: (routeInfo) => routeInfo.publicationCategory.join(', '),
    },
    { title: 'chamberName', extractor: (routeInfo) => routeInfo.chamberName },
    {
      title: 'civilMatterCode',
      extractor: (routeInfo) => routeInfo.civilMatterCode,
    },
    {
      title: 'civilCaseCode',
      extractor: (routeInfo) => routeInfo.civilCaseCode,
    },
    {
      title: 'criminalCaseCode',
      extractor: (routeInfo) => routeInfo.criminalCaseCode,
    },
    { title: 'source', extractor: (routeInfo) => routeInfo.source },
  ];
  return csvExtractor.convertDataToCsv(routeInfos, CSV_FIELDS);
}
