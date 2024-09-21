
import { Test, TestingModule } from '@nestjs/testing';
import { SamlController } from './saml.controller';
import { SamlService } from './saml.service';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

// Création d'objets de mock pour simuler le comportement des services
const mockSamlService = {
    generateMetadata: jest.fn(),
    createLoginRequestUrl: jest.fn(),
    parseResponse: jest.fn(),
    createLogoutRequestUrl: jest.fn(),
};

const mockAuthService = {
    getCookies: jest.fn(),
    setCookies: jest.fn(),
    validateToken: jest.fn(),
    deleteCookies: jest.fn(),
};

describe('SamlController', () => {
    let samlController: SamlController;
    let samlService: SamlService;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SamlController],
            providers: [
                { provide: SamlService, useValue: mockSamlService },
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compile();

        samlController = module.get<SamlController>(SamlController);
        samlService = module.get<SamlService>(SamlService);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMetadata', () => {
        it('should return metadata as XML', () => {
            const res = {
                type: jest.fn(),
                send: jest.fn(),
            };

            const mockMetadata = '<xml>metadata</xml>';
            mockSamlService.generateMetadata.mockReturnValue(mockMetadata);

            samlController.getMetadata(res);

            expect(res.type).toHaveBeenCalledWith('application/xml');
            expect(res.send).toHaveBeenCalledWith(mockMetadata);
            expect(samlService.generateMetadata).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should redirect to the login URL', async () => {
            const res = {
                redirect: jest.fn(),
            };

            const mockUrl = { context: 'http://login-url' };
            mockSamlService.createLoginRequestUrl.mockResolvedValue(mockUrl);

            await samlController.login(res);

            expect(samlService.createLoginRequestUrl).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith(mockUrl.context);
        });

        it('should throw UnauthorizedException on error', async () => {
            const res = {
                redirect: jest.fn(),
            };

            mockSamlService.createLoginRequestUrl.mockRejectedValue(new Error('Login error'));

            await expect(samlController.login(res)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('acs', () => {
        it('should handle the SAML response and redirect the user', async () => {
            const req = {};
            const res = {
                redirect: jest.fn(),
            };

            const mockUserInfos = {
                username: 'test user',
                userId: '123',
                userRole: 'admin',
            };

            const mockSamlResponse = {
                extract: {
                    nameID: 'test.user@label.fr',
                    issuer: 'issuer',
                    response: { issueInstant: 'now' },
                    ...mockUserInfos
                },
            };

            mockSamlService.parseResponse.mockResolvedValue(mockSamlResponse);
            mockAuthService.getCookies.mockReturnValue(null);

            process.env.SSO_USER_TEST_ANNOTATOR_ROLE = mockUserInfos.userRole;
            process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL = 'http://redirect-url';

            await samlController.acs(req, res);

            expect(samlService.parseResponse).toHaveBeenCalledWith(req);
            expect(authService.setCookies).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('http://redirect-url');
        });
    });

    describe('logout', () => {
        it('should redirect to the logout URL and delete cookies', async () => {
            const req = {};
            const res = {
                redirect: jest.fn(),
            };

            const mockCookies = {
                SSO_USER_EMAIL: encodeURIComponent('test.user@label.fr'),
            };

            mockAuthService.getCookies.mockReturnValue(mockCookies);
            const mockLogoutUrl = { context: 'http://logout-url' };
            mockSamlService.createLogoutRequestUrl.mockResolvedValue(mockLogoutUrl);

            await samlController.logout(req, res);

            expect(authService.getCookies).toHaveBeenCalledWith(req);
            expect(authService.deleteCookies).toHaveBeenCalledWith(res, mockCookies);
            expect(res.redirect).toHaveBeenCalledWith(mockLogoutUrl.context);
        });
    });
});

