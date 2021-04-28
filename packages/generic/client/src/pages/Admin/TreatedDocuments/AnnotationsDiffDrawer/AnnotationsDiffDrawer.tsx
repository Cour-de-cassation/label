import { documentType, idModule } from '@label/core';
import React from 'react';
import { Drawer } from '../../../../components';
import { wordings } from '../../../../wordings';
import { SettingsDataFetcher } from '../../../SettingsDataFetcher';
import { AnnotationsDiffDetails } from './AnnotationsDiffDetails';
import { AnnotationsDiffDetailsDataFetcher } from './AnnotationsDiffDetailsDataFetcher';

export { AnnotationsDiffDrawer };

function AnnotationsDiffDrawer(props: {
  close: () => void;
  isOpen: boolean;
  documentId: documentType['_id'] | undefined;
}) {
  const styles = buildStyles();

  return (
    <Drawer
      onClose={props.close}
      title={wordings.treatedDocumentsPage.table.annotationDiffDrawer.title}
      isOpen={!!props.documentId}
    >
      <div style={styles.drawer}>
        {!!props.documentId ? (
          <AnnotationsDiffDetailsDataFetcher documentId={idModule.lib.convertToString(props.documentId)}>
            {({ annotationsDiffDetails }) => (
              <SettingsDataFetcher>
                {({ settings }) => (
                  <AnnotationsDiffDetails annotationsDiffDetails={annotationsDiffDetails} settings={settings} />
                )}
              </SettingsDataFetcher>
            )}
          </AnnotationsDiffDetailsDataFetcher>
        ) : undefined}
      </div>
    </Drawer>
  );

  function buildStyles() {
    return {
      drawer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 600,
      },
    } as const;
  }
}
