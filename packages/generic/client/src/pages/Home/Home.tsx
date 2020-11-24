import React, { FunctionComponent } from 'react';
import { buildAnonymizer } from '@label/core';
import { LayoutGrid } from '../../components';
import { buildAnnotatorStateCommitter } from '../../services/annotatorState';
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
              {({ document, annotations, fetchNewDocument }) => (
                <DocumentAnnotator
                  annotatorState={{ annotations, document, settings }}
                  annotatorStateCommitter={buildAnnotatorStateCommitter()}
                  anonymizer={buildAnonymizer(settings)}
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
