import { idModule, monitoringEntryType } from '@label/core';
import { promises as fs } from 'fs';
import { monitoringEntryService } from '../../modules/monitoringEntry';
import { logger } from '../../utils';

export { extractMonitoringEntriesIntoCsv };

async function extractMonitoringEntriesIntoCsv({
  filename,
}: {
  filename: string;
}) {
  const monitoringEntries = await monitoringEntryService.fetchAllMonitoringEntries();
  const csvContent = convertMonitoringEntriesToCsvContent(monitoringEntries);
  try {
    await fs.writeFile(`./${filename}.csv`, csvContent);
  } catch (err) {
    logger.error(err);
  }
}

function convertMonitoringEntriesToCsvContent(
  monitoringEntries: monitoringEntryType[],
) {
  const CSV_FIELDS: Array<{
    title: string;
    extractor: (monitoringEntry: monitoringEntryType) => string;
  }> = [
    { title: 'ID', extractor: ({ _id }) => idModule.lib.convertToString(_id) },
    {
      title: 'ID du document',
      extractor: ({ documentId }) => idModule.lib.convertToString(documentId),
    },
    {
      title: 'ID du user',
      extractor: ({ userId }) => idModule.lib.convertToString(userId),
    },
    { title: 'Origine', extractor: ({ origin }) => origin },
    { title: 'Action', extractor: ({ action }) => action },
    {
      title: 'Date',
      extractor: ({ creationDate }) => `${creationDate}`,
    },
  ];
  const csvHeadline = CSV_FIELDS.map(({ title }) => title).join(',');
  const csvContent = [
    csvHeadline,
    ...monitoringEntries.map((monitoringEntry) => {
      return CSV_FIELDS.map(({ extractor }) => extractor(monitoringEntry)).join(
        ',',
      );
    }),
  ].join('\n');
  return csvContent;
}
