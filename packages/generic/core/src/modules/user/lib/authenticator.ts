import { buildAuthenticator } from 'sder-core';
import { privateKey } from './privateKey';

export { authenticator };

const authenticator = buildAuthenticator(privateKey);
