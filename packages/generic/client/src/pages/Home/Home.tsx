import React, { FunctionComponent } from 'react';
import { LayoutGrid } from '../../components';
import { DocumentAndAnnotationsDataFetcher } from './DocumentAndAnnotationsDataFetcher';
import { SettingsDataFetcher } from './SettingsDataFetcher';
import { DocumentSwitcher } from './DocumentSwitcher';

const Home: FunctionComponent = () => {
  return (
    <LayoutGrid container>
      <LayoutGrid container item>
        <SettingsDataFetcher alwaysDisplayHeader>
          {({ settings }) => (
            <DocumentAndAnnotationsDataFetcher alwaysDisplayHeader>
              {({ document, annotations, fetchNewDocument }) => (
                <DocumentSwitcher
                  annotations={annotations}
                  document={document}
                  settings={settings}
                  fetchNewDocument={fetchNewDocument}
                />
              )}
            </DocumentAndAnnotationsDataFetcher>
          )}
        </SettingsDataFetcher>
      </LayoutGrid>
    </LayoutGrid>
  );
};

export { Home };
