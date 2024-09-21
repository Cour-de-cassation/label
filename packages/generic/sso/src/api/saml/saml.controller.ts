import { Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { SamlService } from './saml.service';
import { AuthService } from '../auth/auth.service';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

@ApiInternalServerErrorResponse({
  description: 'Une erreur inattendue liée au serveur.',
})
@Controller('saml')
export class SamlController {
  constructor(private readonly samlService: SamlService, private readonly authService: AuthService) {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @Get('metadata')
  getMetadata(@Res() res: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.type('application/xml');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    res.send(this.samlService.generateMetadata());
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @Get('login')
  async login(@Res() res: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const url = await this.samlService.createLoginRequestUrl();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      res.redirect(url?.context);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error LOGIN----- ', error);
      throw new UnauthorizedException(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @Post('acs')
  async acs(@Req() req: any, @Res() res: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await this.samlService.parseResponse(req);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { extract } = response;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userInfos = getTestUserInfos(extract.nameID);
      const user = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        nameID: extract.nameID,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        issuer: extract.issuer,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        issueInstant: extract.response.issueInstant,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        userId: extract.userId || userInfos.userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        username: extract.username || userInfos.username,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        userRole: extract.userRole || userInfos.userRole,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const cookies = this.authService.getCookies(req);
      if (!cookies) {
        this.authService.setCookies(res, user);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.authService.validateToken(cookies?.BEARER_TOKEN);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      const redirectUrl =
        userInfos.userRole === process.env.SSO_USER_TEST_ANNOTATOR_ROLE
          ? process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL
          : process.env.SSO_FRONT_SUCCESS_CONNEXION_OTHER_URL;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      res.redirect(redirectUrl);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error ACS ----- ', error);
      throw new Error(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @Get('logout')
  async logout(@Req() req: any, @Res() res: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const cookies = this.authService.getCookies(req);
      const user = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        nameID:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          cookies && cookies[process.env.SSO_USER_EMAIL]
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              decodeURIComponent(cookies[process.env.SSO_USER_EMAIL])
            : null,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const logoutRequestUrl = await this.samlService.createLogoutRequestUrl(user);
      // delete all cookies to disconnect
      this.authService.deleteCookies(res, cookies);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      res.redirect(logoutRequestUrl?.context);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error logout ----- ', error);
      throw new Error(error);
    }
  }
}

export function getTestUserInfos(nameID: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  if (nameID.indexOf(process.env.SSO_USER_TEST_SCRUTATOR_ROLE) !== -1) {
    return {
      username: process.env.SSO_USER_TEST_SCRUTATOR_NAME,
      userId: process.env.SSO_USER_TEST_SCRUTATOR_ID,
      userRole: process.env.SSO_USER_TEST_SCRUTATOR_ROLE,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  else if (nameID.indexOf(process.env.SSO_USER_TEST_ADMIN_ROLE) !== -1) {
    return {
      username: process.env.SSO_USER_TEST_ADMIN_NAME,
      userId: process.env.SSO_USER_TEST_ADMIN_ID,
      userRole: process.env.SSO_USER_TEST_ADMIN_ROLE,
    };
  } else {
    return {
      username: process.env.SSO_USER_TEST_ANNOTATOR_NAME,
      userId: process.env.SSO_USER_TEST_ANNOTATOR_ID,
      userRole: process.env.SSO_USER_TEST_ANNOTATOR_ROLE,
    };
  }
}
