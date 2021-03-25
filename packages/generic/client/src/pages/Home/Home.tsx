import React from 'react';
import { settingsType } from '@label/core';
import { DocumentsDataFetcher } from './DocumentsDataFetcher';
import { DocumentSwitcher } from './DocumentSwitcher';

const NUMBER_OF_CHOICES = 3;

function Home(props: { settings: settingsType }) {
  return (
    <DocumentsDataFetcher numberOfDocuments={NUMBER_OF_CHOICES}>
      {({ documentsForUser, fetchNewDocumentsForUser }) => (
        <DocumentSwitcher
          choices={documentsForUser}
          fetchNewDocumentsForUser={fetchNewDocumentsForUser}
          settings={props.settings}
        />
      )}
    </DocumentsDataFetcher>
  );
}

export { Home };
