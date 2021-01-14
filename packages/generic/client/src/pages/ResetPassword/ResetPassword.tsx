import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextInput } from '../../components';
import { wordings } from '../../wordings';
import { resetPassword } from '../../services/api';

export { ResetPassword };

type ResetPasswordParamsType = {
  resetPasswordToken: string;
};

const ResetPassword: FunctionComponent = () => {
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [isConfirmationPasswordValid, setIsConfirmationPasswordValid] = useState(true);
  const params = useParams<ResetPasswordParamsType>();
  return (
    <div>
      <TextInput name="password" placeholder="password" type="password" onChange={changePassword} value={password} />
      <TextInput
        name="confirmationPassword"
        placeholder="confirmationPassword"
        onChange={changeConfirmationPassword}
        value={confirmationPassword}
        errorText={isConfirmationPasswordValid ? '' : wordings.resetPasswordPage.passwordsMustBeIdentical}
        type="password"
      />
      <button onClick={handleSubmit}>{wordings.resetPasswordPage.resetPassword}</button>
    </div>
  );

  function changePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function changeConfirmationPassword(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setConfirmationPassword(value);
    setIsConfirmationPasswordValid(password === value);
  }

  async function handleSubmit() {
    try {
      await resetPassword(password, params.resetPasswordToken);
    } catch (error) {
      console.warn(error);
    }
  }
};
