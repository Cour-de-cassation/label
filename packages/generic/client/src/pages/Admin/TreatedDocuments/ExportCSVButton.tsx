import React from 'react';
import { csvExtractor, timeOperator } from '@label/core';
import { ButtonWithIcon, tableRowFieldType } from '../../../components';
import { wordings } from '../../../wordings';

export { ExportCSVButton };

function ExportCSVButton<InputT>(props: { data: Array<InputT>; fields: Array<tableRowFieldType<InputT>> }) {
  const fileDownloadUrl = createCSVFile();
  const fileName = buildFileName();
  const styles = buildStyles();
  return (
    <>
      <a download={fileName} href={fileDownloadUrl} style={styles.downloadLink}>
        <ButtonWithIcon iconName="export" text={wordings.treatedDocumentsPage.table.filter.exportButton} />
      </a>
    </>
  );

  function createCSVFile() {
    const CSVData = csvExtractor.convertDataToCsv(props.data, props.fields);
    const blob = new Blob([CSVData], { type: 'text/csv;charset=UTF-8' });
    const fileDownloadUrl = URL.createObjectURL(blob);
    return fileDownloadUrl;
  }

  function buildFileName() {
    const readableDate = timeOperator.convertTimestampToReadableDate(new Date().getTime(), true);
    return `statistics_${readableDate}.csv`;
  }

  function buildStyles() {
    return {
      downloadLink: {
        color: 'inherit',
        textDecoration: 'none',
      } as const,
    };
  }
}
