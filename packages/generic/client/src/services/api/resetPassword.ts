import { environment, httpRequester } from '@label/core';

export { resetPassword };

type resetPasswordRequestDataType = { password: string; resetPasswordToken: string };

const resetPassword = (password: string, resetPasswordToken: string) =>
  httpRequester.request<resetPasswordRequestDataType>({
    url: `${environment.url.server}/reset-password`,
    headers: null,
    method: 'post',
    data: { password, resetPasswordToken },
  });
