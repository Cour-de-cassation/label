import React from 'react';
import { useQuery } from '@apollo/client';
import { DOCUMENTS_QUERY } from './graphql/documents.query';
import { documentQueryType } from './graphql/documents.types';

const Home = () => {
  const { data, loading, error } = useQuery<documentQueryType>(DOCUMENTS_QUERY);
  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error || !data) {
    return <div>Une erreur est survenue</div>;
  }
  return (
    <div>
      {data.documents.map((document) => (
        <div>{document._id}</div>
      ))}
    </div>
  );
};

export { Home };
