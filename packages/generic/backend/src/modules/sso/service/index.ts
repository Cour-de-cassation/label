import { buildCallAttemptsRegulator } from 'sder-core';
import { acs, getMetadata, getUserByEmail, login, logout } from './ssoService';

const DELAY_BETWEEN_LOGIN_ATTEMPTS_IN_SECONDS = 1 * 1000;

const MAX_LOGIN_ATTEMPTS = 1;

function buildSsoService() {
  buildCallAttemptsRegulator(
    MAX_LOGIN_ATTEMPTS,
    DELAY_BETWEEN_LOGIN_ATTEMPTS_IN_SECONDS,
  );

  return {
    acs,
    getMetadata,
    login,
    logout,
    getUserByEmail,
  };
}

export const ssoService = buildSsoService();
