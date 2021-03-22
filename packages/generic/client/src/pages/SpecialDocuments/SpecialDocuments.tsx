import React from 'react';
import { MainHeader } from '../../components';
import { heights } from '../../styles';
import { wordings } from '../../wordings';
import { SpecialDocumentsDataFetcher } from './SpecialDocumentsDataFetcher';

export { SpecialDocuments };

function SpecialDocuments() {
  const styles = buildStyles();

  return (
    <>
      <div style={styles.header}>
        <MainHeader title={wordings.specialDocumentsPage.title} />
      </div>
      <div style={styles.contentContainer}>
        <SpecialDocumentsDataFetcher>
          {({ specialDocuments }) => (
            <div>
              {specialDocuments.map((specialDocument) => (
                <div key={specialDocument.documentId}>{specialDocument.documentId}</div>
              ))}
            </div>
          )}
        </SpecialDocumentsDataFetcher>
      </div>
    </>
  );

  function buildStyles() {
    return {
      header: {
        height: heights.header,
      },
      contentContainer: {
        display: 'flex',
        width: '100vw',
        height: heights.annotatorPanel,
      },
    } as const;
  }
}
