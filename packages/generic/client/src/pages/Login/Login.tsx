import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { TextInput } from '../../components/TextInput';
import { login } from '../../services/api';
import { setBearerTokenIntoLocalStorage } from '../../services/localStorage';

export { Login };

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  return (
    <div>
      <TextInput name="email" type="email" placeholder="email" onChange={changeEmail} value={email} />
      <TextInput name="password" type="password" placeholder="password" onChange={changePassword} value={password} />
      <button onClick={handleSubmit}>Se connecter</button>
      <Link to="/reset-password-request">Mot de passe oublié ?</Link>
    </div>
  );

  function changeEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function changePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit() {
    try {
      const { data } = await login(email, password);
      setBearerTokenIntoLocalStorage(data);
      history.push('/');
    } catch (error) {
      console.warn(error);
    }
  }
};
