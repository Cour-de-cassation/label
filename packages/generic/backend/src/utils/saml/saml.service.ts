import * as samlify from 'samlify';
import * as fs from 'fs';

// import * as validator from '@authenio/samlify-node-xmllint';

// samlify.setSchemaValidator(validator);
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export class SamlService {
  private sp;
  private idp;

  constructor() {
    // Initialiser le Service Provider (SP)
    const spProps = {
      entityID: process.env.SSO_SP_ENTITY_ID,
      assertionConsumerService: [
        {
          Binding: samlify.Constants.namespace.binding.post,
          Location: process.env.SSO_SP_ASSERTION_CONSUMER_SERVICE_LOCATION,
        },
      ],
      authnRequestsSigned: true,
      wantAssertionsSigned: true,
      isAssertionEncrypted: true,

      privateKey: fs.readFileSync(
        String(process.env.SSO_SP_PRIVATE_KEY),
        'utf8',
      ),
      encPrivateKey: fs.readFileSync(
        String(process.env.SSO_SP_PRIVATE_KEY),
        'utf8',
      ),
      signingCert: fs.readFileSync(String(process.env.SSO_CERTIFICAT), 'utf8'),
      signatureConfig: {
        prefix: 'ds',
        location: {
          reference: '/EntityDescriptor',
          action: 'append',
        },
        signatureAlgorithm: 'http://www.w3.org/2000/09/xmldsig#',
        digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#',
      },
    } as any;

    this.sp = samlify.ServiceProvider(spProps);
    // Initialiser l'Identity Provider (IdP)
    const idpProps = {
      metadata: fs.readFileSync(String(process.env.SSO_IDP_METADATA), 'utf8'),
      encCert: fs.readFileSync(String(process.env.SSO_CERTIFICAT), 'utf8'),
      signingCert: fs.readFileSync(String(process.env.SSO_CERTIFICAT), 'utf8'),
      wantAuthnRequestsSigned: true,
      singleSignOnService: [
        {
          Binding: samlify.Constants.namespace.binding.redirect,
          Location: process.env.SSO_IDP_SINGLE_SIGN_ON_SERVICE_LOCATION,
        },
      ],
      singleLogoutService: [
        {
          Binding: samlify.Constants.namespace.binding.redirect,
          Location: process.env.SSO_IDP_SINGLE_LOGOUT_SERVICE_LOCATION,
        },
      ],
      wantLogoutRequestSigned: true,
    } as any;
    this.idp = samlify.IdentityProvider(idpProps);
  }

  generateMetadata(): string {
    return this.sp.getMetadata();
  }

  createLoginRequestUrl() {
    return this.sp.createLoginRequest(this.idp, 'redirect').context;
  }

  async parseResponse(request?: { body?: { SAMLResponse: string } }) {
    const samlResponse = request?.body?.SAMLResponse;
    if (!samlResponse) throw new Error('Missing SAMLResponse in request body');

    const samlContent = Buffer.from(samlResponse, 'base64').toString();

    const extractFields = [
      ...samlify.Extractor.loginResponseFields(samlContent),
      {
        key: 'nameID',
        localPath: ['Response', 'Assertion', 'Subject', 'NameID'],
        attributes: [],
        shortcut: samlContent as unknown,
      },
      {
        key: 'sessionIndex',
        localPath: ['Response', 'Assertion', 'AuthnStatement'],
        attributes: ['SessionIndex'],
        shortcut: samlContent as unknown,
      },
      {
        key: 'attributes',
        localPath: ['Response', 'Assertion', 'AttributeStatement', 'Attribute'],
        index: ['Name'],
        attributePath: ['AttributeValue'],
        attributes: [],
        shortcut: samlContent as unknown,
      },
    ];

    const extract: {
      nameID?: string;
      sessionIndex?: string;
      attributes?: Record<string, string[] | string | null>;
    } = samlify.Extractor.extract(samlContent, extractFields) as {
      nameID?: string;
      sessionIndex?: string;
      attributes?: Record<string, string[] | string | null>;
    };

    const roleKey = process.env.SSO_ATTRIBUTE_ROLE || 'role';
    const appName = process.env.SSO_APP_NAME || '';

    if (extract.attributes) {
      const roleKeyValue = extract.attributes[roleKey];

      const normalizedRoles = Array.isArray(roleKeyValue)
        ? roleKeyValue
        : roleKeyValue
        ? [roleKeyValue]
        : [];

      extract.attributes[roleKey] = normalizedRoles
        .filter((role) => role.includes(appName))
        .map((role) => role.replace(`${appName}:`, ''));
    }

    return {
      samlContent,
      extract,
    };
  }

  createLogoutRequestUrl(user: { nameID: string; sessionIndex: string }) {
    const { context } = this.sp.createLogoutRequest(this.idp, 'redirect', {
      logoutNameID: user.nameID,
      id: user.sessionIndex,
      nameIDFormat: process.env.SSO_NAME_ID_FORMAT,
      sessionIndex: user.sessionIndex,
      signRequest: true,
      signatureAlgorithm: process.env.SSO_SIGNATURE_ALGORITHM,
    });

    const urlLogoutRequest = new URL(context);

    // Nécessaire pour le logout de pages blanches
    urlLogoutRequest.searchParams.append('logout', '1');

    return urlLogoutRequest.toString();
  }
}
