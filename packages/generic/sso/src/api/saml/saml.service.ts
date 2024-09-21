import { Injectable } from '@nestjs/common';
import * as samlify from 'samlify';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
//import * as validator from '@authenio/samlify-node-xmllint';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
samlify.setSchemaValidator(
  {
    validate: () => Promise.resolve(true),
  } /*|| validator*/,
);

@Injectable()
export class SamlService {
  private sp;
  private idp;

  constructor() {
    // Initialiser le Service Provider (SP)
    const isKeycloakIdp = Boolean(process.env.SSO_IDP_KEYCLOAK);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const spProps = {
      entityID: isKeycloakIdp ? process.env.SSO_SP_ENTITY_ID : process.env.SSO_SP_ENTITY_ID_VM,
      assertionConsumerService: [
        {
          Binding: samlify.Constants.namespace.binding.post,
          Location: process.env.SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION,
        },
      ],
      authnRequestsSigned: !isKeycloakIdp,
      wantAssertionsSigned: !isKeycloakIdp,
      isAssertionEncrypted: false, // keycloak
      ...(isKeycloakIdp
        ? {}
        : {
            signingCert: fs.readFileSync(String(process.env.SSO_CERTIFICAT_VM), 'utf8'),
            privateKey: fs.readFileSync(String(process.env.SSO_SP_PRIVATE_KEY), 'utf8'),
          }),
    } as any;

    this.sp = samlify.ServiceProvider(spProps);
    // Initialiser l'Identity Provider (IdP)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const idpProps = {
      metadata: fs.readFileSync(
        isKeycloakIdp ? String(process.env.SSO_IDP_METADATA) : String(process.env.SSO_IDP_METADATA_VM),
      ),
      wantAuthnRequestsSigned: !isKeycloakIdp,
      singleSignOnService: [
        {
          Binding: samlify.Constants.namespace.binding.redirect,
          Location: isKeycloakIdp
            ? process.env.SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION
            : process.env.SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION_VM,
        },
      ],
      singleLogoutService: [
        {
          Binding: samlify.Constants.namespace.binding.redirect,
          Location: isKeycloakIdp
            ? process.env.SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION
            : process.env.SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION_VM,
        },
      ],
    } as any;
    this.idp = samlify.IdentityProvider(idpProps);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  generateMetadata() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
    return this.sp.getMetadata();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  createLoginRequestUrl() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return this.sp.createLoginRequest(this.idp, 'redirect');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async parseResponse(request: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (['local', 'dev'].includes(process.env.SSO_NODE_ENV)) {
      const samlContent = Buffer.from(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        request.body.SAMLResponse,
        'base64',
      ).toString();

      const extractFields = [
        ...samlify.Extractor.loginResponseFields(samlContent),
        {
          key: 'nameID',
          localPath: ['Response', 'Assertion', 'Subject', 'NameID'],
          attributes: [],
          shortcut: samlContent as unknown,
        },
      ];

      return {
        samlContent: samlContent,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        extract: samlify.Extractor.extract(samlContent, extractFields),
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      return this.sp.parseLoginResponse(this.idp, 'post', {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        body: request.body,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async createLogoutRequestUrl(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return this.sp.createLogoutRequest(this.idp, 'redirect', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      logoutNameID: user.nameID,
    });
  }
}
