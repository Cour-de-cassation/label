import { SamlService } from '@label/sso';
import { logger } from '../../../../utils';
import { buildUserRepository } from '../../repository';
import { userService } from './index';

export { samlService };

function ssoService() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
  return new SamlService();
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const samlService = ssoService();

export async function getMetadataSso() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  return samlService.generateMetadata();
}

export async function loginSso() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const { context } = await samlService.createLoginRequestUrl();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return context;
}

export async function logoutSso(nameID: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const user = { nameID: nameID };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const { context } = await samlService.createLogoutRequestUrl(user);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return context;
}

export async function acsSso(req: any, res: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const response = await samlService.parseResponse(req);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-unsafe-assignment
  const { extract } = response;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = await getUserByEmail(extract?.nameID);
    await logger.error({
      operationName: 'user connected',
      msg: `${user.email}`,
    });
    return setUserSessionAndReturnRedirectUrl(req, res, user);
  } catch (err) {
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
      const createdUser = await getUserByEmail(newUser.email);
      await logger.log({
        operationName: `Auto-provided user`,
        msg: `successfully created user ${createdUser.email}`,
      });
      return setUserSessionAndReturnRedirectUrl(req, res, createdUser);
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

function setUserSessionAndReturnRedirectUrl(req: any, res: any, user: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (req.session) {
    logger.error({
      operationName: 'acsSso setUserSessionAndReturnRedirectUrl ',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      msg: `set the user ${user.email} in session`,
    });
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
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return user.role === 'annotator'
    ? ((process.env
        .SSO_FRONT_SUCCESS_CONNEXION_ANNOTATOR_URL as unknown) as string)
    : ((process.env
        .SSO_FRONT_SUCCESS_CONNEXION_OTHER_URL as unknown) as string);
}
