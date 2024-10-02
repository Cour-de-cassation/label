import { SamlService } from '@label/sso';
import { buildUserRepository, userService } from '../../user';
import { logger } from '../../../utils';

export { samlService };

function ssoService() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
  return new SamlService();
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const samlService = ssoService();

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

export async function logout(user : {nameID: string; sessionIndex: string}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const { context } = await samlService.createLogoutRequestUrl(user);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return context;
}

export async function acs(req: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const response = await samlService.parseResponse(req);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-assignment
  const { extract } = response;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const user = await getUserByEmail(extract?.nameID);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await logger.log({
      operationName: 'user connected',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      msg: `${user.email}`,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return setUserSessionAndReturnRedirectUrl(req, user, extract?.sessionIndex);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await logger.log({
      operationName: `catch autoprovision user ${JSON.stringify(err)}`,
      msg: `${err}`,
    });

    if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        err.message.indexOf(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            `No matching user for email ${extract.nameID}`,
        ) !== -1
    ) {
      const newUser = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        name: extract.name || extract.nameID,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        email: extract.nameID,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        role: extract.role || 'annotator',
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
