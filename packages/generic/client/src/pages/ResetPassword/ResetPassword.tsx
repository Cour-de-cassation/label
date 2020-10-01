import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { TextInput } from '../../components/TextInput';
import { resetPassword } from '../../services/api';

export { ResetPassword };

const ResetPassword: FunctionComponent = () => {
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  return (
    <div>
      <TextInput name="password" placeholder="password" onChange={changePassword} value={password} />
      <TextInput
        name="confirmationPassword"
        placeholder="confirmationPassword"
        onChange={changeConfirmationPassword}
        value={confirmationPassword}
      />
      <button onClick={handleSubmit}>Réinitialiser le mot de passe</button>
    </div>
  );

  function changePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function changeConfirmationPassword(event: ChangeEvent<HTMLInputElement>) {
    setConfirmationPassword(event.target.value);
  }

  async function handleSubmit() {
    try {
      await resetPassword(password);
    } catch (error) {
      console.warn(error);
    }
  }
};
