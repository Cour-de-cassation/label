import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { TextInput } from '../../components/TextInput';
import { resetPassword } from '../../services/api';

export { ResetPassword };

const ResetPassword: FunctionComponent = () => {
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
      await resetPassword(email);
    } catch (error) {
      console.warn(error);
    }
  }
};
