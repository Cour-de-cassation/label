import { environment, httpRequester } from '@label/core';

export { resetPasswordRequest };

type resetPasswordRequestRequestDataType = { email: string };

const resetPasswordRequest = (email: string) =>
  httpRequester.request<resetPasswordRequestRequestDataType>({
    url: `${environment.url.server}/reset-password-request`,
    headers: null,
    method: 'post',
    data: { email },
  });
