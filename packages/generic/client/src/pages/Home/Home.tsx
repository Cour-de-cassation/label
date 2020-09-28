import React from 'react';
import { useQuery } from '@apollo/client';
import { COURT_DECISIONS_QUERY } from './graphql/courtDecisions.query';
import { courtDecisionQueryType } from './graphql/courtDecisions.types';

const Home = () => {
  const { data, loading, error } = useQuery<courtDecisionQueryType>(COURT_DECISIONS_QUERY);
  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error) {
    return <div>Une erreur est survenue</div>;
  }
  return <div>Youpi ! Voici l'id de la décision : {data && data.courtDecisions[0] && data.courtDecisions[0]._id}</div>;
};

export { Home };
