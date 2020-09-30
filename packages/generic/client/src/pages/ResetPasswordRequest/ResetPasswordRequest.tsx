import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { TextInput } from '../../components/TextInput';
import { resetPasswordRequest } from '../../services/api';

export { ResetPasswordRequest };

const ResetPasswordRequest: FunctionComponent = () => {
  const [email, setEmail] = useState('');

  return (
    <div>
      <TextInput name="email" placeholder="email" onChange={changeEmail} value={email} />
      <button onClick={handleSubmit}>Envoyer un mail de réinitialisation</button>
    </div>
  );

  function changeEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  async function handleSubmit() {
    try {
      await resetPasswordRequest(email);
    } catch (error) {
      console.warn(error);
    }
  }
};
