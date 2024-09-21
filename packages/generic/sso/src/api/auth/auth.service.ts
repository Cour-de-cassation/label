import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getTokenForUser(user: any) {
    const payload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      userId: user.userId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      email: user.nameID,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      iss: user.issuer,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      userRole: user.userRole,
    };
    try {
      const jwtOptions = {
        secret: process.env.JWT_PRIVATE_KEY,
        expiresIn: parseInt(process.env.SSO_ONE_WEEK, 10),
      };
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        bearer_token: this.jwtService.sign(payload, jwtOptions),
      };
    } catch (error: any) {
      throw new UnauthorizedException(error);
    }
  }

  getCookies(req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    let cookies = req.rawHeaders.find((element: any) => element.includes(process.env.SSO_BEARER_TOKEN));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    cookies = cookies?.replace(/\s+/g, '').split(';');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return cookies?.reduce((obj: any, item: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const [key, value] = item.split('=');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      obj[key] = value;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return obj;
    }, {});
  }

  setCookies(res: any, user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { bearer_token } = this.getTokenForUser(user);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.cookie(process.env.SSO_BEARER_TOKEN, bearer_token, {
      httpOnly: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.cookie(process.env.SSO_USER_ID, user.userId, {
      httpOnly: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.cookie(process.env.SSO_USER_EMAIL, user.nameID, { httpOnly: false });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.cookie(process.env.SSO_USER_NAME, user.username, {
      httpOnly: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.cookie(process.env.SSO_USER_ROLE, user.userRole, { httpOnly: false });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.cookie(process.env.SSO_USER_PASSWORD_TIME_VALIDITY_STATUS, `valid`, {
      httpOnly: false,
    });
  }

  validateToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      return this.jwtService.verify(token, { secret: process.env.JWT_PRIVATE_KEY });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  deleteCookies(res: any, cookies: any) {
    Object.keys(cookies).forEach(cookieName => {
      res.cookie(cookieName, '', { expires: new Date(0), httpOnly: true });
    });
  }
}
