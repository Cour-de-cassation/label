import { httpRequester } from '@label/core';
import { getLabelUrl } from './getLabelUrl';

export { resetPasswordRequest };

type resetPasswordRequestRequestDataType = { email: string };

const resetPasswordRequest = (email: string) =>
  httpRequester.request<resetPasswordRequestRequestDataType>({
    url: `${getLabelUrl()}/reset-password-request`,
    headers: null,
    method: 'post',
    data: { email },
  });
