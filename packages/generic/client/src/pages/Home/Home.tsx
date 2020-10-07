import React, { FunctionComponent } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { DOCUMENTS_QUERY } from './graphql/documents.query';
import { documentQueryType } from './graphql/documents.types';
import { deleteBearerTokenInLocalStorage } from '../../services/localStorage';
import { Document } from './Document';
import { AnnotationsPanel } from './AnnotationsPanel';

const Home: FunctionComponent = () => {
  const { data, loading, error } = useQuery<documentQueryType>(DOCUMENTS_QUERY);
  const history = useHistory();

  return (
    <div>
      <button onClick={logout}>Se déconnecter</button>
      {renderDocument()}
    </div>
  );

  function renderDocument() {
    if (loading) {
      return <div>Chargement...</div>;
    }
    if (error || !data || data.documents.length === 0) {
      return <div>Une erreur est survenue</div>;
    }

    const document = data.documents[0];

    return (
      <div>
        <AnnotationsPanel />
        <Document document={document} />;
      </div>
    );
  }

  function logout() {
    deleteBearerTokenInLocalStorage();
    history.push('/login');
  }
};

export { Home };
