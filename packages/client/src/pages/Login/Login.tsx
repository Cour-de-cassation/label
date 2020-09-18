import React, { FunctionComponent, useState } from 'react';
import { login } from '../../services/api';

export { Login };

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const changeEmail = (event: any) => setEmail(event.target.value);
  const changePassword = (event: any) => setPassword(event.target.value);
  const handleSubmit = async () => {
    const response = await login(email, password);
    console.log(response);
  };
  return (
    <div>
      <input name="email" placeholder="email" onChange={changeEmail} value={email} />
      <input name="password" placeholder="password" onChange={changePassword} value={password} />
      <button onClick={handleSubmit}>Se connecter</button>
    </div>
  );
};
