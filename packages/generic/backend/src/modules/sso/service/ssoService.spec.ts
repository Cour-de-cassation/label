import {
  acs,
  getMetadata,
  login,
  logout,
  samlService,
  setUserSessionAndReturnRedirectUrl,
} from './ssoService';
import { buildUserRepository } from '../../user';
import { buildUserService } from '../../user/service/userService';

jest.mock('@label/sso', () => ({
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
        name: 'Test User',
        role: 'annotator',
        sessionIndex: 'session123',
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
  userService: {
    createUser: jest.fn(),
  },
}));
jest.mock('../../user', () => ({
  buildUserRepository: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn().mockResolvedValue({
      _id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'annotator',
    }),
  })),
}));

process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL =
  'http://localhost:55432/label/annotation';
(process.env.SSO_FRONT_SUCCESS_CONNEXION_ADMIN_SCRUTATOR_URL =
  'http://localhost:55432/label/admin/main/summary'),
  (process.env.SSO_FRONT_SUCCESS_CONNEXION_PUBLICATOR_URL =
    'http://localhost:55432/label/publishable-documents');

describe('SSO CNX functions', () => {
  describe('getMetadataSso', () => {
    it('should return SAML metadata', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const metadata = await getMetadata();
      expect(metadata).toBe('<metadata>');
    });
  });

  describe('loginSso', () => {
    it('should return login URL', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const loginUrl = await login();
      expect(loginUrl).toBe('login-url');
    });
  });

  describe('logoutSso', () => {
    it('should return logout URL', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const logoutUrl = await logout({
        nameID: 'test-user-id',
        sessionIndex: 'test-session-index',
      });
      expect(logoutUrl).toBe('logout-url');
    });
  });

  describe('acsSso', () => {
    it('should handle ACS SSO and return a redirect URL', async () => {
      const mockReq = {
        body: { SAMLResponse: 'mock-saml-response' },
        session: {
          user: {
            _id: '123',
            email: 'test@example.com',
            name: 'Test User',
            role: 'annotator',
          },
        },
      };
      const redirectUrl = await acs(mockReq);
      expect(redirectUrl).toContain(
        process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL,
      );
      expect(mockReq.session.user).toBeDefined();
      expect(mockReq.session.user.email).toBe('test@example.com');
    });

    const mockReq = {
      body: { SAMLResponse: 'dummyResponse' },
    };

    it('should handle the case where user does not exist and is auto-provisioned', async () => {
      const mockNewUser = { email: 'newuser@example.com' };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (samlService.parseResponse as jest.Mock).mockResolvedValue({
        extract: {
          nameID: 'newuser@example.com',
          sessionIndex: 'session123',
          attributes: {
            role: ['ANNOTATEUR'],
            email: 'newuser@example.com',
            name: 'New User',
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
      const userRepository = buildUserRepository();
      jest
        .spyOn(userRepository, 'findByEmail')
        .mockRejectedValue(
          new Error('No matching user for email newuser@example.com'),
        );

      const userService = buildUserService();
      jest
        .spyOn(userService, 'createUser')
        .mockResolvedValue('User created successfully');

      jest
        .spyOn(userRepository, 'findByEmail')
        .mockReturnValue(mockNewUser as any);

      const result = await acs(mockReq);

      expect(result).toBeDefined();
    });
  });

  describe('setUserSessionAndReturnRedirectUrl', () => {
    const mockRequest = {
      session: {
        user: {},
      },
    };

    it('should return the correct URL for annotator role', () => {
      const user = {
        _id: '1',
        name: 'Annotator',
        role: 'annotator',
        email: 'annotator@test.com',
      };
      const result = setUserSessionAndReturnRedirectUrl(
        mockRequest,
        user,
        'test-session-index',
      );
      expect(mockRequest.session.user).toEqual({
        ...user,
        sessionIndex: 'test-session-index',
      });
      expect(result).toEqual(
        process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL,
      );
    });

    it('should return the correct URL for admin role', () => {
      const user = {
        _id: '2',
        name: 'Admin',
        role: 'admin',
        email: 'admin@test.com',
      };
      const result = setUserSessionAndReturnRedirectUrl(
        mockRequest,
        user,
        'test-session-index',
      );

      expect(mockRequest.session.user).toEqual({
        ...user,
        sessionIndex: 'test-session-index',
      });
      expect(result).toEqual(
        process.env.SSO_FRONT_SUCCESS_CONNEXION_ADMIN_SCRUTATOR_URL,
      );
    });

    it('should return the correct URL for scrutator role', () => {
      const user = {
        _id: '3',
        name: 'Scrutator',
        role: 'scrutator',
        email: 'scrutator@test.com',
      };
      const result = setUserSessionAndReturnRedirectUrl(
        mockRequest,
        user,
        'test-session-index',
      );

      expect(mockRequest.session.user).toEqual({
        ...user,
        sessionIndex: 'test-session-index',
      });
      expect(result).toEqual(
        process.env.SSO_FRONT_SUCCESS_CONNEXION_ADMIN_SCRUTATOR_URL,
      );
    });

    it('should return the correct URL for publicator role', () => {
      const user = {
        _id: '4',
        name: 'Publicator',
        role: 'publicator',
        email: 'publicator@test.com',
      };
      const result = setUserSessionAndReturnRedirectUrl(
        mockRequest,
        user,
        'test-session-index',
      );

      expect(mockRequest.session.user).toEqual({
        ...user,
        sessionIndex: 'test-session-index',
      });
      expect(result).toEqual(
        process.env.SSO_FRONT_SUCCESS_CONNEXION_PUBLICATOR_URL,
      );
    });

    it('should throw an error for an invalid role', () => {
      const user = {
        _id: '5',
        name: 'InvalidRole',
        role: 'invalidRole',
        email: 'invalid@test.com',
      };

      expect(() => {
        setUserSessionAndReturnRedirectUrl(
          mockRequest,
          user,
          'test-session-index',
        );
      }).toThrowError("Role doesn't exist in label");
    });
  });
});
