import { httpRequester } from '@label/core';
import { environment } from '../../config/environment';

export { login };

type loginRequestDataType = { email: string; password: string };
type loginResponseDataType = string;

const login = (email: string, password: string) =>
  httpRequester.request<loginRequestDataType, loginResponseDataType>({
    url: `${environment.API_URL}/login`,
    headers: null,
    method: 'post',
    data: { email, password },
  });
