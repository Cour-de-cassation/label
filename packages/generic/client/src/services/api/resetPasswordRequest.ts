import { httpRequester } from '@label/core';
import { environment } from '../../config/environment';

export { resetPasswordRequest };

type resetPasswordRequestRequestDataType = { email: string };

const resetPasswordRequest = (email: string) =>
  httpRequester.request<resetPasswordRequestRequestDataType>({
    url: `${environment.API_URL}/reset-password-request`,
    headers: null,
    method: 'post',
    data: { email },
  });
