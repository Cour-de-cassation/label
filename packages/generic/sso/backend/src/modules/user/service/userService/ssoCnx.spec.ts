import { acsSso, getMetadataSso, loginSso, logoutSso } from './ssoCnx';

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
jest.mock('../../../../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('./index', () => ({
  userService: {
    createUser: jest.fn(),
  },
}));
jest.mock('../../repository', () => ({
  buildUserRepository: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn().mockResolvedValue({
      _id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'annotator',
    }),
  })),
}));

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
      const mockRes = { cookie: jest.fn() };

      const redirectUrl = await acsSso(mockReq, mockRes);
      expect(redirectUrl).toContain('annotator'); // Check if it's the annotator URL
      expect(mockReq.session.user).toBeDefined();
      expect(mockReq.session.user.email).toBe('test@example.com');
    });
  });
});
