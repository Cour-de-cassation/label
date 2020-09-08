import React from 'react'
import { useQuery } from '@apollo/client'
import { COURT_DECISION_QUERY } from './graphql/courtDecision.query'
import { CourtDecisionQuery } from './graphql/courtDecision.types';

const Home = () => {
  const { data, loading, error } = useQuery<CourtDecisionQuery>(COURT_DECISION_QUERY);
  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error) {
    return <div>Une erreur est survenue</div>;
  }
  return <div>Youpi ! Voici l'id de la décision : {data && data.courtDecision.id}</div>
}

export { Home }