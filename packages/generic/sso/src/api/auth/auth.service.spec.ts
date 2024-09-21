import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    // Test pour getTokenForUser
    describe('getTokenForUser', () => {
        it('should return a token for a valid user', () => {
            const mockUser = {
                userId: '123',
                nameID: 'test.user@label.fr',
                issuer: 'issuer',
                userRole: 'admin',
            };

            const mockToken = 'mockJwtToken';
            jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

            const result = service.getTokenForUser(mockUser);

            expect(jwtService.sign).toHaveBeenCalledWith(
                {
                    userId: mockUser.userId,
                    email: mockUser.nameID,
                    iss: mockUser.issuer,
                    userRole: mockUser.userRole,
                },
                {
                    secret: process.env.JWT_PRIVATE_KEY,
                    expiresIn: parseInt(process.env.SSO_ONE_WEEK, 10),
                },
            );
            expect(result).toEqual({ bearer_token: mockToken });
        });

        it('should throw UnauthorizedException if an error occurs', () => {
            const mockUser = { userId: '123', nameID: 'test.user@label.fr' };
            jest.spyOn(jwtService, 'sign').mockImplementation(() => {
                throw new Error('Token error');
            });

            expect(() => service.getTokenForUser(mockUser)).toThrow(UnauthorizedException);
        });
    });

    // Test pour getCookies
    describe('getCookies', () => {
        it('should return cookies from the request', () => {
            const req = {
                rawHeaders: ['cookie', `SSO_BEARER_TOKEN=myToken; SSO_USER_ID=123`],
            };
            const result = service.getCookies(req);
            expect(result).toEqual({
                SSO_BEARER_TOKEN: 'myToken',
                SSO_USER_ID: '123',
            });
        });
    });

    // Test pour setCookies
    describe('setCookies', () => {
        it('should set cookies for a user', () => {
            const res = {
                cookie: jest.fn(),
            };
            const mockUser = {
                userId: '123',
                nameID: 'test.user@label.fr',
                username: 'testUser',
                userRole: 'admin',
            };

            const mockToken = 'mockJwtToken';
            jest.spyOn(service, 'getTokenForUser').mockReturnValue({ bearer_token: mockToken });

            service.setCookies(res, mockUser);

            expect(res.cookie).toHaveBeenCalledWith(process.env.SSO_BEARER_TOKEN, mockToken, { httpOnly: false });
            expect(res.cookie).toHaveBeenCalledWith(process.env.SSO_USER_ID, mockUser.userId, { httpOnly: false });
            expect(res.cookie).toHaveBeenCalledWith(process.env.SSO_USER_EMAIL, mockUser.nameID, { httpOnly: false });
            expect(res.cookie).toHaveBeenCalledWith(process.env.SSO_USER_NAME, mockUser.username, { httpOnly: false });
            expect(res.cookie).toHaveBeenCalledWith(process.env.SSO_USER_ROLE, mockUser.userRole, { httpOnly: false });
        });
    });

    // Test pour validateToken
    describe('validateToken', () => {
        it('should return the decoded token when valid', () => {
            const mockToken = 'validToken';
            const mockDecodedToken = { userId: '123' };
            jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedToken);

            const result = service.validateToken(mockToken);

            expect(jwtService.verify).toHaveBeenCalledWith(mockToken, { secret: process.env.JWT_PRIVATE_KEY });
            expect(result).toEqual(mockDecodedToken);
        });

        it('should throw UnauthorizedException when token is invalid', () => {
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                throw new Error('Invalid token');
            });

            expect(() => service.validateToken('invalidToken')).toThrow(UnauthorizedException);
        });
    });

    // Test pour deleteCookies
    describe('deleteCookies', () => {
        it('should delete all cookies', () => {
            const res = {
                cookie: jest.fn(),
            };
            const cookies = {
                cookie1: 'value1',
                cookie2: 'value2',
            };

            service.deleteCookies(res, cookies);

            expect(res.cookie).toHaveBeenCalledWith('cookie1', '', { expires: new Date(0), httpOnly: true });
            expect(res.cookie).toHaveBeenCalledWith('cookie2', '', { expires: new Date(0), httpOnly: true });
        });
    });
});
