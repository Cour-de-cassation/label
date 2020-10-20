import React, { FunctionComponent } from 'react';
import { LayoutGrid } from '../../components';
import { DocumentAnnotator } from './DocumentAnnotator';
import { DocumentAndAnnotationsDataFetcher } from './DocumentAndAnnotationsDataFetcher';
import { SettingsDataFetcher } from './SettingsDataFetcher';

const Home: FunctionComponent = () => {
  return (
    <LayoutGrid container>
      <LayoutGrid item>
        <SettingsDataFetcher>
          {({ settings }) => (
            <DocumentAndAnnotationsDataFetcher>
              {({ document, annotations }) => (
                <DocumentAnnotator settings={settings} document={document} annotations={annotations} />
              )}
            </DocumentAndAnnotationsDataFetcher>
          )}
        </SettingsDataFetcher>
      </LayoutGrid>
    </LayoutGrid>
  );
};

export { Home };
