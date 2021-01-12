import { environment } from '../../config/environment';

export { login };

async function login(email: string, password: string) {
  const response = await fetch(`${environment.API_URL}/login`, {
    body: JSON.stringify({ email, password }),
    cache: 'default',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    mode: 'cors',
  });

  return {
    data: (await response.text()) as string,
    statusCode: response.status,
  };
}
