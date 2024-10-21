import { SamlService } from '@label/sso';
import { buildUserRepository, userService } from '../../user';
import { logger } from '../../../utils';
import every  from "lodash/every";
import includes from "lodash/includes";

export { samlService };

function ssoSamlService() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
  return new SamlService();
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const samlService = ssoSamlService();

export async function getMetadata() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return samlService.generateMetadata();
}

export async function login() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const { context } = await samlService.createLoginRequestUrl();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return context;
}

export async function logout(user: { nameID: string; sessionIndex: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const { context } = await samlService.createLogoutRequestUrl(user);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return context;
}

export async function acs(req: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  const response = await samlService.parseResponse(req);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { extract } = response;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const user = await getUserByEmail(extract?.nameID);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await logger.log({
      operationName: 'user connected',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      msg: user.email,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return setUserSessionAndReturnRedirectUrl(req, user, extract?.sessionIndex);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await logger.log({
      operationName: `catch autoprovision user ${JSON.stringify(err)}`,
      msg: `${err}`,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (err.message.includes(`No matching user for email ${extract?.nameID}`)) {
      const { attributes } = extract as Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const roles = attributes[`${process.env.SSO_ATTRIBUTE_ROLE}`].map((item: string) => item.toLowerCase()) as string[];

      const appRoles = (process.env.SSO_APP_ROLES as string).toLowerCase().split(',');
      const userRolesInAppRoles = every(roles, (element) => includes(appRoles, element));

      if (!roles.length || !userRolesInAppRoles) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const errorMsg = `User ${extract.nameID}, role ${roles} doesn't exist in application ${process.env.SSO_APP_NAME}`;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        logger.error({ operationName: 'ssoService', msg: errorMsg });
        throw new Error(errorMsg);
      }

      const newUser = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          attributes[`${process.env.SSO_ATTRIBUTE_FULLNAME}`] ||
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `${attributes[`${process.env.SSO_ATTRIBUTE_NAME}`]} ${
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            attributes[`${process.env.SSO_ATTRIBUTE_FIRSTNAME}`]
          }`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        email: attributes[`${process.env.SSO_ATTRIBUTE_MAIL}`],
        role: roles[0] as
          | 'annotator'
          | 'scrutator'
          | 'admin'
          | 'publicator',
      };

      await userService.createUser(newUser);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const createdUser = await getUserByEmail(newUser.email);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      await logger.log({
        operationName: `Auto-provided user`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        msg: `successfully created user ${createdUser.email}`,
      });

      return setUserSessionAndReturnRedirectUrl(
        req,
        createdUser,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        extract?.sessionIndex,
      );
    } else {
      throw new Error(`Error in acsSso: ${err}`);
    }
  }
}

export async function getUserByEmail(email: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const userRepository = buildUserRepository();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  return await userRepository.findByEmail(email);
}

export function setUserSessionAndReturnRedirectUrl(
  req: any,
  user: any,
  sessionIndex: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (req.session) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    req.session.user = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      _id: user._id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      name: user.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      role: user.role,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      email: user.email,
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!roleToUrlMap[user.role]) {
    throw new Error(`Role doesn't exist in label`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return roleToUrlMap[user.role];
}
