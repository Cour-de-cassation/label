import { annotationType, documentType, settingsType } from '@label/core';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { LayoutGrid } from '../../components';
import { deleteBearerTokenInLocalStorage } from '../../services/localStorage';
import { heights } from '../../styles';
import { DocumentAnnotator } from './DocumentAnnotator';
import { DocumentAndAnnotationsDataFetcher } from './utils/DocumentAndAnnotationsDataFetcher';
import { SettingsDataFetcher } from './utils/SettingsDataFetcher';

const Home: FunctionComponent = () => {
  const history = useHistory();
  const styles = buildStyles();
  return (
    <LayoutGrid container>
      <LayoutGrid item style={styles.header}>
        <button onClick={logout}>Se déconnecter</button>
      </LayoutGrid>
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

  function logout() {
    deleteBearerTokenInLocalStorage();
    history.push('/login');
  }
};

function buildStyles() {
  return {
    header: {
      height: heights.header,
    },
  };
}

export { Home };
