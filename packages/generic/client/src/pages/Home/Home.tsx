import React, { FunctionComponent } from 'react';
import { LayoutGrid } from '../../components';
import { DocumentsDataFetcher } from './DocumentsDataFetcher';
import { SettingsDataFetcher } from './SettingsDataFetcher';
import { DocumentSwitcher } from './DocumentSwitcher';

const NUMBER_OF_CHOICES = 3;

const Home: FunctionComponent = () => {
  return (
    <LayoutGrid container>
      <LayoutGrid container item>
        <SettingsDataFetcher alwaysDisplayHeader>
          {({ settings }) => (
            <DocumentsDataFetcher alwaysDisplayHeader numberOfDocuments={NUMBER_OF_CHOICES}>
              {({ documentsToBeTreated, fetchNewDocumentsToBeTreated }) => (
                <DocumentSwitcher
                  choices={documentsToBeTreated}
                  fetchNewDocumentsToBeTreated={fetchNewDocumentsToBeTreated}
                  settings={settings}
                />
              )}
            </DocumentsDataFetcher>
          )}
        </SettingsDataFetcher>
      </LayoutGrid>
    </LayoutGrid>
  );
};

export { Home };
