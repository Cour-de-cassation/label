import { environment } from '@label/core';

const localEnvironment = {
  API_URL: `http://localhost:${environment.port.server}`,
};

export { localEnvironment as environment };
