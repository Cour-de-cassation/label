import { httpRequester } from '@label/core';
import { getLabelUrl } from './getLabelUrl';

export { login };

type loginRequestDataType = { email: string; password: string };
type loginResponseDataType = string;

const login = (email: string, password: string) =>
  httpRequester.request<loginRequestDataType, loginResponseDataType>({
    url: `${getLabelUrl()}/login`,
    headers: null,
    method: 'post',
    data: { email, password },
  });
