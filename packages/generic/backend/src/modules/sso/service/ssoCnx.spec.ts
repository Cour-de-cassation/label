import {
  acsSso,
  getMetadataSso,
  loginSso,
  logoutSso,
  setUserSessionAndReturnRedirectUrl,
} from './ssoCnx';

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
//process.env.SSO_IDP_KEYCLOAK = true;

describe('SSO CNX functions', () => {
  describe('getMetadataSso', () => {
    it('should return SAML metadata', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const metadata = await getMetadataSso();
      expect(metadata).toBe('<metadata>');
    });
  });

  describe('loginSso', () => {
    it('should return login URL', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const loginUrl = await loginSso();
      expect(loginUrl).toBe('login-url');
    });
  });

  describe('logoutSso', () => {
    it('should return logout URL', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const logoutUrl = await logoutSso('test-user-id');
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
      const redirectUrl = await acsSso(mockReq);
      expect(redirectUrl).toContain(
        process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL,
      ); // Check if it's the annotator URL
      expect(mockReq.session.user).toBeDefined();
      expect(mockReq.session.user.email).toBe('test@example.com');
    });
  });

  describe('setUserSessionAndReturnRedirectUrl', () => {
    const mockRequest = {
      session: {
        user: {},
      },
    };

    /*beforeEach(() => {
      jest.clearAllMocks();
    });*/

    it('should return the correct URL for annotator role', () => {
      const user = {
        _id: '1',
        name: 'Annotator',
        role: 'annotator',
        email: 'annotator@test.com',
      };
      const result = setUserSessionAndReturnRedirectUrl(mockRequest, user);
      expect(mockRequest.session.user).toEqual(user);
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
      const result = setUserSessionAndReturnRedirectUrl(mockRequest, user);

      expect(mockRequest.session.user).toEqual(user);
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
      const result = setUserSessionAndReturnRedirectUrl(mockRequest, user);

      expect(mockRequest.session.user).toEqual(user);
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
      const result = setUserSessionAndReturnRedirectUrl(mockRequest, user);

      expect(mockRequest.session.user).toEqual(user);
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
        setUserSessionAndReturnRedirectUrl(mockRequest, user);
      }).toThrowError("Role doesn't exist in label");
    });
  });
});
