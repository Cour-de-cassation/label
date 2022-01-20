import { useCustomTheme, Drawer } from 'pelta-design-system';
import React from 'react';
import format from 'string-template';
import { documentType, idModule } from '@label/core';
import { wordings } from '../../../../wordings';
import { SettingsDataFetcher } from '../../../SettingsDataFetcher';
import { AnnotationsDiffDetails } from './AnnotationsDiffDetails';
import { AnnotationsDiffDetailsDataFetcher } from './AnnotationsDiffDetailsDataFetcher';

export { AnnotationsDiffDrawer };
export type { annotationDiffDocumentInfoType };

type annotationDiffDocumentInfoType = {
  _id: documentType['_id'];
  documentNumber: documentType['documentNumber'];
  userName: string;
};

function AnnotationsDiffDrawer(props: { close: () => void; documentInfo: annotationDiffDocumentInfoType | undefined }) {
  const theme = useCustomTheme();
  const styles = buildStyles();

  const subtitle = props.documentInfo
    ? format(wordings.treatedDocumentsPage.table.annotationDiffDrawer.subtitle, {
        documentNumber: props.documentInfo.documentNumber,
        userName: props.documentInfo.userName,
      })
    : undefined;

  return (
    <Drawer
      onClose={props.close}
      title={wordings.treatedDocumentsPage.table.annotationDiffDrawer.title}
      subtitle={subtitle}
      isOpen={!!props.documentInfo}
    >
      <div style={styles.drawer}>
        {!!props.documentInfo ? (
          <AnnotationsDiffDetailsDataFetcher documentId={idModule.lib.convertToString(props.documentInfo._id)}>
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
        marginTop: theme.spacing * 4,
        width: 600,
      },
    } as const;
  }
}
