import React, { FunctionComponent } from 'react';
import { useQuery } from '@apollo/client';
import { DOCUMENTS_QUERY } from './graphql/documents.query';
import { documentQueryType } from './graphql/documents.types';
import { deleteBearerTokenInLocalStorage } from '../../services/localStorage';

const Home: FunctionComponent = () => {
  const { data, loading, error } = useQuery<documentQueryType>(DOCUMENTS_QUERY);
  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error || !data) {
    return <div>Une erreur est survenue</div>;
  }
  return (
    <div>
      <button onClick={logout}>Se déconnecter</button>
      {data.documents.map((document) => (
        <div key={document._id}>{document._id}</div>
      ))}
    </div>
  );

  function logout() {
    deleteBearerTokenInLocalStorage();
  }
};

export { Home };
