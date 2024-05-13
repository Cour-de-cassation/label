import { buildAuthenticator } from 'sder-core';

export { authenticator };

const authenticator = buildAuthenticator(process.env.JWT_PRIVATE_KEY ?? 'local_private_key');
