import { httpRequester } from '@label/core';
import { environment } from '../../config/environment';

export { login };

const login = (email: string, password: string) =>
  httpRequester.request({
    url: `${environment.API_URL}/login`,
    headers: null,
    method: 'post',
    data: { email, password },
  });
