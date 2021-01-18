import { dependencyManager, environment } from '@label/core';

const localEnvironment = {
  API_URL: dependencyManager.inject({
    forLocal: `http://localhost:${environment.port.server}`,
    forPreProd: `http://bkpanonym:${environment.port.server}`,
    forProd: `http://srpanonym:${environment.port.server}`,
  }),
};

export { localEnvironment as environment };
