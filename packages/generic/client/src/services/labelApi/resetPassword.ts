import { httpRequester } from '@label/core';
import { getLabelUrl } from './getLabelUrl';

export { resetPassword };

type resetPasswordRequestDataType = { password: string; resetPasswordToken: string };

const resetPassword = (password: string, resetPasswordToken: string) =>
  httpRequester.request<resetPasswordRequestDataType>({
    url: `${getLabelUrl()}/reset-password`,
    headers: null,
    method: 'post',
    data: { password, resetPasswordToken },
  });
