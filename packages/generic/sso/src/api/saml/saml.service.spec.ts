import { Test, TestingModule } from '@nestjs/testing';
import { SamlService } from './saml.service';
import * as fs from 'fs';
import * as samlify from 'samlify';
//import * as validator from '@authenio/samlify-node-xmllint';

// Moquer fs et samlify
jest.mock('fs');
jest.mock('samlify', () => {
  const Extractor = {
    loginResponseFields: jest.fn().mockReturnValue([]), // Simule un tableau vide ou ajoute des champs simulés si nécessaire
    extract: jest.fn().mockReturnValue({
      // Simuler la réponse extraite ici
      samlContent: 'mock-saml-content',
      fields: [],
    }),
  };

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
    Extractor, // Ajoutez Extractor ici
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
//jest.mock('validator');

describe('SamlService', () => {
  let service: SamlService;

  beforeEach(async () => {
    // Simuler la lecture de fichier dans fs.readFileSync
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
  });

  it('should create login request URL', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const loginUrl = await service.createLoginRequestUrl();
    expect(loginUrl).toEqual('http://login-url');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(samlify.ServiceProvider().createLoginRequest).toHaveBeenCalled();
  });

  it('should parse login response', async () => {
    const mockRequest = {
      body: {
        SAMLResponse: Buffer.from('mock-saml-response').toString('base64'),
      },
    };
    process.env.SSO_NODE_ENV = 'dev';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await service.parseResponse(mockRequest);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.samlContent).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(samlify.ServiceProvider().parseLoginResponse).not.toHaveBeenCalled();
  });

  it('should create logout request URL', async () => {
    const mockUser = { nameID: 'test.user@label.fr' };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const logoutUrl = await service.createLogoutRequestUrl(mockUser);
    expect(logoutUrl).toEqual('http://logout-url');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(samlify.ServiceProvider().createLogoutRequest).toHaveBeenCalledWith(expect.anything(), 'redirect', {
      logoutNameID: mockUser.nameID,
    });
  });
});
