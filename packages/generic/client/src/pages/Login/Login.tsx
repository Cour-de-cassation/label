import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { TextInput } from '../../components/TextInput';
import { login } from '../../services/api';
import { setBearerTokenIntoLocalStorage } from '../../services/localStorage';

export { Login };

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <TextInput name="email" placeholder="email" onChange={changeEmail} value={email} />
      <TextInput name="password" placeholder="password" onChange={changePassword} value={password} />
      <button onClick={handleSubmit}>Se connecter</button>
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
    } catch (error) {
      console.warn(error);
    }
  }
};
