import { privateKey } from './privateKey';
import { buildAuthenticator } from 'sder';

export { authenticator };

const authenticator = buildAuthenticator(privateKey);
