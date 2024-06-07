import { buildAuthenticator } from 'sder-core';
import * as dotenv from 'dotenv';

export { authenticator };

if (process.env.RUN_MODE === 'LOCAL') {
  dotenv.config();
}

const authenticator = buildAuthenticator(process.env.JWT_PRIVATE_KEY ?? 'local_private_key');
