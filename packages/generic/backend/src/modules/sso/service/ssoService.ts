import { SamlService } from '@label/sso';
import { buildUserRepository, userService } from '../../user';
import { logger } from '../../../utils';
import every from 'lodash/every';
import includes from 'lodash/includes';
import { idModule, userType } from '@label/core';
import { Request } from 'express';

export { samlService };

export interface BindingContext {
  context: string;
  id: string;
}

export interface ParseResponseResult {
  samlContent: string;
  extract: {
    nameID: string;
    sessionIndex: string;
    attributes: Record<string, string[] | string>;
  };
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-return */

function ssoSamlService() {
  return new SamlService();
}

const samlService = ssoSamlService();

export async function getMetadata() {
  return samlService.generateMetadata() as string;
}

export async function login() {
  const {
    context,
  } = (await samlService.createLoginRequestUrl()) as BindingContext;
  return context;
}

export async function logout(user: { nameID: string; sessionIndex: string }) {
  const { context } = (await samlService.createLogoutRequestUrl(
    user,
  )) as BindingContext;
  return context;
}

export async function acs(req: any) {
  const response = (await samlService.parseResponse(
    req,
  )) as ParseResponseResult;
  const { extract } = response;

  try {
    const user = (await getUserByEmail(extract?.nameID)) as userType;

    await logger.log({
      operationName: 'user connected',
      msg: user.email,
    });

    return setUserSessionAndReturnRedirectUrl(req, user, extract?.sessionIndex);
  } catch (err: unknown) {
    await logger.log({
      operationName: `catch autoprovision user ${JSON.stringify(err)}`,
      msg: `${err}`,
    });

    if (
      err instanceof Error &&
      err.message.includes(`No matching user for email ${extract?.nameID}`)
    ) {
      const { attributes } = extract;
      const roles = (attributes[
        `${process.env.SSO_ATTRIBUTE_ROLE}`
      ] as string[]).map((item: string) => item.toLowerCase()) as string[];

      const appRoles = (process.env.SSO_APP_ROLES as string)
        .toLowerCase()
        .split(',');
      const userRolesInAppRoles = every(roles, (element) =>
        includes(appRoles, element),
      );

      if (!roles.length || !userRolesInAppRoles) {
        const errorMsg = `User ${extract.nameID}, role ${roles} doesn't exist in application ${process.env.SSO_APP_NAME}`;
        logger.error({ operationName: 'ssoService', msg: errorMsg });
        throw new Error(errorMsg);
      }

      const newUser = {
        name:
          (attributes[`${process.env.SSO_ATTRIBUTE_FULLNAME}`] as string) ||
          `${attributes[`${process.env.SSO_ATTRIBUTE_NAME}`] as string} ${
            attributes[`${process.env.SSO_ATTRIBUTE_FIRSTNAME}`] as string
          }`,
        email: attributes[`${process.env.SSO_ATTRIBUTE_MAIL}`] as string,
        role: roles[0] as 'annotator' | 'scrutator' | 'admin' | 'publicator',
      };

      await userService.createUser(newUser);

      const createdUser = (await getUserByEmail(newUser.email)) as userType;

      await logger.log({
        operationName: `Auto-provided user`,
        msg: `successfully created user ${createdUser.email}`,
      });

      return setUserSessionAndReturnRedirectUrl(
        req,
        createdUser,
        extract?.sessionIndex,
      );
    } else {
      throw new Error(`Error in acsSso: ${err}`);
    }
  }
}

export async function getUserByEmail(email: string) {
  const userRepository = buildUserRepository();
  return (await userRepository.findByEmail(email)) as userType;
}

export function setUserSessionAndReturnRedirectUrl(
  req: Request,
  user: userType,
  sessionIndex: string,
) {
  if (req.session) {
    req.session.user = {
      _id: idModule.lib.convertToString(user._id),
      name: user.name as string,
      role: user.role as string,
      email: user.email as string,
      sessionIndex: sessionIndex,
    };
  }

  const roleToUrlMap: Record<string, string> = {
    annotator: process.env.SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL as string,
    admin: process.env
      .SSO_FRONT_SUCCESS_CONNEXION_ADMIN_SCRUTATOR_URL as string,
    scrutator: process.env
      .SSO_FRONT_SUCCESS_CONNEXION_ADMIN_SCRUTATOR_URL as string,
    publicator: process.env
      .SSO_FRONT_SUCCESS_CONNEXION_PUBLICATOR_URL as string,
  };

  if (!roleToUrlMap[user.role]) {
    throw new Error(`Role doesn't exist in label`);
  }

  return roleToUrlMap[user.role];
}
