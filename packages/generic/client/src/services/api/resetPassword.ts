import { httpRequester } from '@label/core';
import { environment } from '../../config/environment';

export { resetPassword };

const resetPassword = (password: string, resetPasswordToken: string) =>
  httpRequester.request({
    url: `${environment.API_URL}/reset-password`,
    headers: null,
    method: 'post',
    data: { password, resetPasswordToken },
  });
