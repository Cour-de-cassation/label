import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextInput } from '../../components/TextInput';
import { resetPassword } from '../../services/api';

export { ResetPassword };

type ResetPasswordParamsType = {
  resetPasswordToken: string;
};

const ResetPassword: FunctionComponent = () => {
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const params = useParams<ResetPasswordParamsType>();
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
      await resetPassword(password, params.resetPasswordToken);
    } catch (error) {
      console.warn(error);
    }
  }
};
