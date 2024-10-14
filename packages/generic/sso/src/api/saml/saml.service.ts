import { Injectable } from '@nestjs/common';
import * as samlify from 'samlify'; // import "*" est à proscire à mon sens, mieux vaut importer que ce qu'on a besoin..
import * as fs from 'fs';
import * as validator from '@authenio/samlify-node-xmllint';

samlify.setSchemaValidator(validator);

@Injectable()
export class SamlService {
  private sp;
  private idp;

  constructor() {
    // Initialiser le Service Provider (SP)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

      privateKey: fs.readFileSync(String(process.env.SSO_SP_PRIVATE_KEY), 'utf8'),
      encPrivateKey: fs.readFileSync(String(process.env.SSO_SP_PRIVATE_KEY), 'utf8'),
      signingCert: fs.readFileSync(String(process.env.SSO_CERTIFICAT), 'utf8'),
      signatureConfig: {
        prefix: 'ds',
        location: {
          reference: '/EntityDescriptor',
          action: 'append',
        },
        signatureAlgorithm: 'http://www.w3.org/2000/09/xmldsig#', // faut il prevoire une mise à jour dans les années à venir?
        digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#',
      },
    } as any; // pourquoi ne pas en faire un typage stricte ?? car le as any est permissive à mon sens

    this.sp = samlify.ServiceProvider(spProps);
    // Initialiser l'Identity Provider (IdP)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    } as any; // même commentaire qu'au dessus ?
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

  async parseResponse(request: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
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
        shortcut: samlContent as unknown, // pas precis, est il possible de preciser le type de ce que l'on recois ?
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const extract = samlify.Extractor.extract(samlContent, extractFields);
    // eslint-disable-next-line no-console
    //console.log('extract ', extract);
    const roleKey = process.env.SSO_ATTRIBUTE_ROLE || 'role';
    const appName = process.env.SSO_APP_NAME || '';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (typeof extract.attributes?.[roleKey] === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      extract.attributes[roleKey] = [extract.attributes[roleKey]];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    extract.attributes[roleKey] = extract.attributes[roleKey]
      ?.filter((role: string) => role.includes(appName))
      .map((role: string) => role.replace(`${appName}:`, ''));

    return {
      samlContent,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      extract,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async createLogoutRequestUrl(user: any) { // ne faut il pas typer le user ? comment resoudre les eslint-disable ??
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return this.sp.createLogoutRequest(this.idp, 'redirect', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      logoutNameID: user.nameID,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      id: user.sessionIndex,
      nameIDFormat: process.env.SSO_NAME_ID_FORMAT,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      sessionIndex: user.sessionIndex,
      signRequest: true,
      signatureAlgorithm: process.env.SSO_SIGNATURE_ALGORITHM,
    });
  }
}
