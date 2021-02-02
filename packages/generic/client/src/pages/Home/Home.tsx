import React from 'react';
import { LayoutGrid } from '../../components';
import { DocumentsDataFetcher } from './DocumentsDataFetcher';
import { DocumentSwitcher } from './DocumentSwitcher';
import { settingsType } from '@label/core/src';

const NUMBER_OF_CHOICES = 3;

function Home(props: { settings: settingsType }) {
  return (
    <LayoutGrid container>
      <LayoutGrid container item>
        <DocumentsDataFetcher numberOfDocuments={NUMBER_OF_CHOICES}>
          {({ documentsToBeTreated, fetchNewDocumentsToBeTreated }) => (
            <DocumentSwitcher
              choices={documentsToBeTreated}
              fetchNewDocumentsToBeTreated={fetchNewDocumentsToBeTreated}
              settings={props.settings}
            />
          )}
        </DocumentsDataFetcher>
      </LayoutGrid>
    </LayoutGrid>
  );
}

export { Home };
