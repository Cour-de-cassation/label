import { httpRequester } from '@label/core';
import { environment } from '../../config/environment';

export { resetPassword };

type resetPasswordRequestDataType = { password: string; resetPasswordToken: string };

const resetPassword = (password: string, resetPasswordToken: string) =>
  httpRequester.request<resetPasswordRequestDataType>({
    url: `${environment.API_URL}/reset-password`,
    headers: null,
    method: 'post',
    data: { password, resetPasswordToken },
  });
