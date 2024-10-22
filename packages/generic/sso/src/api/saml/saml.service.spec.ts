import { Test, TestingModule } from '@nestjs/testing';
import { SamlService } from './saml.service';
import * as fs from 'fs';
import * as samlify from 'samlify';
import * as validator from '@authenio/samlify-node-xmllint';

jest.mock('fs');
jest.mock('samlify', () => {
  const Extractor = {
    loginResponseFields: jest.fn().mockReturnValue([]),
    extract: jest.fn().mockReturnValue({
      // Simuler la réponse extraite ici
      samlContent: 'mock-saml-content',
      fields: [],
      attributes: { nom: 'Xx', prenom: 'Alain', role: ['ANNOTATEUR'], email: 'mail.573@justice.fr', name: 'Xx Alain' },
    }),
  };
  jest.mock('@authenio/samlify-node-xmllint', () => ({
    validate: jest.fn(() => true),
  }));

  return {
    // Autres méthodes de samlify
    ServiceProvider: jest.fn().mockReturnValue({
      getMetadata: jest.fn().mockReturnValue('<SPMetadata />'),
      createLoginRequest: jest.fn().mockResolvedValue('http://login-url'),
      parseLoginResponse: jest.fn().mockResolvedValue({
        samlContent: 'parsed-response',
      }),
      createLogoutRequest: jest.fn().mockResolvedValue('http://logout-url'),
    }),
    IdentityProvider: jest.fn().mockReturnValue({}),
    Extractor,
    Constants: {
      namespace: {
        binding: {
          post: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
          redirect: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
        },
      },
    },
    setSchemaValidator: jest.fn().mockReturnValue({
      validate: () => jest.fn().mockResolvedValue(true),
    }),
  };
});

describe('SamlService', () => {
  let service: SamlService;

  beforeEach(async () => {
    (fs.readFileSync as jest.Mock).mockReturnValue('<IDPMetadata />');

    const module: TestingModule = await Test.createTestingModule({
      providers: [SamlService],
    }).compile();

    service = module.get<SamlService>(SamlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate metadata', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const metadata = service.generateMetadata();
    expect(metadata).toEqual('<SPMetadata />');
    expect(samlify.ServiceProvider).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    expect(validator.validate()).toBeTruthy();
  });

  it('should create login request URL', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const loginUrl = await service.createLoginRequestUrl();
    expect(loginUrl).toEqual('http://login-url');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(samlify.ServiceProvider().createLoginRequest).toHaveBeenCalled();
  });

  describe('parseResponse', () => {
    it('should throw an error if SAMLResponse is missing', async () => {
      const request = {};
      await expect(service.parseResponse(request)).rejects.toThrow('Missing SAMLResponse in request body');
    });

    it('should decode the SAMLResponse correctly', async () => {
      const base64Response = Buffer.from('<SAMLResponse></SAMLResponse>').toString('base64');
      const request = { body: { SAMLResponse: base64Response } };

      const samlContent = await service.parseResponse(request);

      expect(samlContent.samlContent).toBe('<SAMLResponse></SAMLResponse>');
    });

    it('should extract fields correctly', async () => {
      const base64Response = Buffer.from('<SAMLResponse></SAMLResponse>').toString('base64');
      const request = { body: { SAMLResponse: base64Response } };

      const mockExtract = {
        attributes: {
          role: ['app:role1', 'other:role2'],
        },
      };
      (samlify.Extractor.extract as jest.Mock).mockReturnValue(mockExtract);

      process.env.SSO_ATTRIBUT_ROLE = 'role';
      process.env.SSO_APP_NAME = 'app';

      const result = await service.parseResponse(request);

      expect(result.extract).toEqual(mockExtract);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.extract.attributes.role).toEqual(['role1']);
    });

    it('should handle roles correctly when role is a string', async () => {
      const base64Response = Buffer.from('<SAMLResponse></SAMLResponse>').toString('base64');
      const request = { body: { SAMLResponse: base64Response } };

      const mockExtract = {
        attributes: {
          role: 'app:role1',
        },
      };
      (samlify.Extractor.extract as jest.Mock).mockReturnValue(mockExtract);

      process.env.SSO_ATTRIBUT_ROLE = 'role';
      process.env.SSO_APP_NAME = 'app';

      const result = await service.parseResponse(request);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.extract.attributes.role).toEqual(['role1']); // Vérifie que le rôle est bien traité
    });

    it('should not modify roles if appName is empty', async () => {
      const base64Response = Buffer.from('<SAMLResponse></SAMLResponse>').toString('base64');
      const request = { body: { SAMLResponse: base64Response } };

      const mockExtract = {
        attributes: {
          role: ['app:role1', 'other:role2'],
        },
      };
      (samlify.Extractor.extract as jest.Mock).mockReturnValue(mockExtract);

      process.env.SSO_ATTRIBUT_ROLE = 'role';
      process.env.SSO_APP_NAME = '';

      const result = await service.parseResponse(request);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.extract.attributes.role.length).toEqual(2);
    });
  });

  it('should create logout request URL', async () => {
    const mockUser = { nameID: 'test.user@label.fr', sessionIndex: undefined };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const logoutUrl = await service.createLogoutRequestUrl(mockUser);
    expect(logoutUrl).toEqual('http://logout-url');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(samlify.ServiceProvider().createLogoutRequest).toHaveBeenCalledTimes(1);
  });
});
