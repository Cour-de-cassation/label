import { acs, getMetadata, getUserByEmail, login, logout } from './ssoService';

function buildSsoService() {
  return {
    acs,
    getMetadata,
    login,
    logout,
    getUserByEmail,
  };
}

export const ssoService = buildSsoService();
