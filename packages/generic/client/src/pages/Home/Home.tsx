import React from 'react';
import { useQuery } from '@apollo/client';
import { DOCUMENTS_QUERY } from './graphql/documents.query';
import { documentQueryType } from './graphql/documents.types';

const Home = () => {
  const { data, loading, error } = useQuery<documentQueryType>(DOCUMENTS_QUERY);
  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error) {
    return <div>Une erreur est survenue</div>;
  }
  return <div>Youpi ! Voici l'id de la décision : {data && data.documents[0] && data.documents[0]._id}</div>;
};

export { Home };
