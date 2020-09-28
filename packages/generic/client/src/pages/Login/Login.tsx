import React, { FunctionComponent, useState } from 'react';
import { login } from '../../services/api';
import { setBearerTokenIntoLocalStorage } from '../../services/localStorage';

export { Login };

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <input name="email" placeholder="email" onChange={changeEmail} value={email} />
      <input name="password" placeholder="password" onChange={changePassword} value={password} />
      <button onClick={handleSubmit}>Se connecter</button>
    </div>
  );

  function changeEmail(event: any) {
    setEmail(event.target.value);
  }

  function changePassword(event: any) {
    setPassword(event.target.value);
  }

  async function handleSubmit() {
    const { data } = await login(email, password);
    setBearerTokenIntoLocalStorage(data);
  }
};
