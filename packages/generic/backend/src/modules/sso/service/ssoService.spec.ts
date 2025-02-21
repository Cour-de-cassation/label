import {
  acs,
  compareUser,
  getMetadata,
  getUserFromSSO,
  login,
  logout,
  setUserSessionAndReturnRedirectUrl,
} from './ssoService';
import { userType } from '@label/core';

jest.mock('../../../utils/saml', () => ({
  SamlService: jest.fn().mockImplementation(() => ({
    generateMetadata: jest.fn().mockReturnValue('<metadata>'),
    createLoginRequestUrl: jest
      .fn()
      .mockResolvedValue({ context: 'login-url' }),
    createLogoutRequestUrl: jest
      .fn()
      .mockResolvedValue({ context: 'logout-url' }),
    parseResponse: jest.fn().mockResolvedValue({
      extract: {
        nameID: 'test@example.com',
        sessionIndex: '63e7d8764f1a0a2f6c123456',
        attributes: {
          role: ['ANNOTATOR'],
          email: 'test@example.com',
          name: 'Test User',
        },
      },
    }),
  })),
}));
jest.mock('../../../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../../user', () => ({
  buildUserRepository: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn().mockResolvedValueOnce({
      _id: '63e7d8764f1a0a2f6c123457',
      email: 'test@example.com',
      name: 'Test User',
      role: 'annotator',
    }),
  })),
  userService: {
    createUser: jest.fn(),
    updateUser: jest.fn().mockResolvedValue({ success: true }),
  },
}));

process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL =
  'http://localhost:55432/label/annotation';
process.env.SSO_FRONT_SUCCESS_CONNEXION_ADMIN_SCRUTATOR_URL =
  'http://localhost:55432/label/admin/main/summary';
process.env.SSO_FRONT_SUCCESS_CONNEXION_PUBLICATOR_URL =
  'http://localhost:55432/label/publishable-documents';
process.env.SSO_ATTRIBUTE_ROLE = 'role';
process.env.SSO_APP_ROLES = 'admin,annotator,publicator,scrutator';
process.env.SSO_APP_NAME = 'LABEL';

describe('SSO CNX functions', () => {
  describe('getMetadataSso', () => {
    it('should return SAML metadata', async () => {
      const metadata = await getMetadata();
      expect(metadata).toBe('<metadata>');
    });
  });

  describe('acsSso', () => {
    it('should update an existing user if there are differences', async () => {
      const mockReq = {
        body: { SAMLResponse: 'mock-saml-response' },
        session: {},
      };
      const result = await acs(mockReq);

      expect(result).toContain(
        process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL,
      );
    });
  });

  describe('compareUser', () => {
    it('should return true if name or role is different', () => {
      const userSSO = ({
        name: 'New Name',
        role: 'annotator',
        email: 'test@example.com',
        _id: '63e7d8764f1a0a2f6c123457',
      } as unknown) as userType;
      const userDB = ({
        name: 'Old Name',
        role: 'admin',
        email: 'test@example.com',
        _id: '63e7d8764f1a0a2f6c123457',
      } as unknown) as userType;

      const result = compareUser(userSSO, userDB);
      expect(result).toBe(true);
    });

    it('should return false if name and role are the same', () => {
      const userSSO = ({
        name: 'Test User',
        role: 'annotator',
        email: 'test@example.com',
        _id: '63e7d8764f1a0a2f6c123457',
      } as unknown) as userType;
      const userDB = ({
        name: 'Test User',
        role: 'annotator',
        email: 'test@example.com',
        _id: '63e7d8764f1a0a2f6c123457',
      } as unknown) as userType;

      const result = compareUser(userSSO, userDB);
      expect(result).toBe(false);
    });

    it('should throw error', () => {
      expect(() => compareUser(undefined, undefined)).toThrowError(
        `Both objects must be defined.`,
      );
    });
  });

  describe('loginSso', () => {
    it('should return login URL', async () => {
      const loginUrl = await login();
      expect(loginUrl).toBe('login-url');
    });
  });

  describe('logoutSso', () => {
    it('should return logout URL', async () => {
      const logoutUrl = await logout({
        nameID: 'test-user-id',
        sessionIndex: '63e7d8764f1a0a2f6c123431',
      });
      expect(logoutUrl).toBe('logout-url');
    });
  });

  describe('getUserFromSSO when throw error', () => {
    expect(() => {
      getUserFromSSO({
        nameID: 'fake@example.com',
        sessionIndex: '63e7d8764f1a0a2f6c123478',
        attributes: {
          role: ['ANNOT'],
          email: 'fake@example.com',
          name: 'Fake User',
        },
      });
    }).toThrowError(
      "User fake@example.com, role annot doesn't exist in application LABEL",
    );
  });

  describe('setUserSessionAndReturnRedirectUrl', () => {
    const mockRequest = ({
      session: {
        user: {},
      },
      body: {
        SAMLResponse: 'mock-saml-response',
      },
      params: {
        id: '123456789',
      },
    } as unknown) as Partial<Request>;

    it('should throw an error for an invalid role', () => {
      const user = ({
        _id: '63e7d8764f1a0a2f6c123489',
        name: 'InvalidRole',
        role: 'invalidRole',
        email: 'invalid@test.com',
      } as unknown) as userType;

      expect(() => {
        setUserSessionAndReturnRedirectUrl(
          mockRequest,
          user,
          '63e7d8764f1a0a2f6c123456',
        );
      }).toThrowError("Role doesn't exist in label");
    });
  });
});
