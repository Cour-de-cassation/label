import { httpRequester } from '@label/core';
import { environment } from '../../config/environment';

export { resetPasswordRequest };

const resetPasswordRequest = (email: string) =>
  httpRequester.request({
    url: `${environment.API_URL}/reset-password-request`,
    headers: null,
    method: 'post',
    data: { email },
  });
