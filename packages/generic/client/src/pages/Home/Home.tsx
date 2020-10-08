import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { deleteBearerTokenInLocalStorage } from '../../services/localStorage';
import { DocumentAnnotator } from './DocumentAnnotator';

const Home: FunctionComponent = () => {
  const history = useHistory();

  return (
    <div>
      <button onClick={logout}>Se déconnecter</button>
      <DocumentAnnotator />
    </div>
  );

  function logout() {
    deleteBearerTokenInLocalStorage();
    history.push('/login');
  }
};

export { Home };
